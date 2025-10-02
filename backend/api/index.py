import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для синхронизации данных класса между устройствами
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Password',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    headers = event.get('headers', {})
    password = headers.get('x-password') or headers.get('X-Password')
    
    if password != '6745Q-':
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Неверный пароль'})
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT photo_url FROM t_p1679283_9d_website_project.class_info LIMIT 1')
                class_info = cur.fetchone()
                
                cur.execute('SELECT id, title, content, date FROM t_p1679283_9d_website_project.news ORDER BY id')
                news = cur.fetchall()
                
                cur.execute('SELECT id, name FROM t_p1679283_9d_website_project.students ORDER BY id')
                students = cur.fetchall()
                
                cur.execute('SELECT id, subject, task, due, status FROM t_p1679283_9d_website_project.homework ORDER BY id')
                homework = cur.fetchall()
                
                cur.execute('SELECT id, title, type, size, file_url FROM t_p1679283_9d_website_project.materials ORDER BY id')
                materials = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'classPhoto': class_info['photo_url'] if class_info else None,
                        'newsItems': [dict(row) for row in news],
                        'students': [dict(row) for row in students],
                        'homeworkItems': [dict(row) for row in homework],
                        'materialItems': [dict(row) for row in materials]
                    })
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            data = body_data.get('data')
            
            with conn.cursor() as cur:
                if action == 'add_news':
                    cur.execute(
                        'INSERT INTO t_p1679283_9d_website_project.news (title, content, date) VALUES (%s, %s, %s) RETURNING id',
                        (data['title'], data['content'], data['date'])
                    )
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': new_id})
                    }
                
                elif action == 'add_student':
                    cur.execute(
                        'INSERT INTO t_p1679283_9d_website_project.students (name) VALUES (%s) RETURNING id',
                        (data['name'],)
                    )
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': new_id})
                    }
                
                elif action == 'add_homework':
                    cur.execute(
                        'INSERT INTO t_p1679283_9d_website_project.homework (subject, task, due, status) VALUES (%s, %s, %s, %s) RETURNING id',
                        (data['subject'], data['task'], data['due'], data.get('status', 'pending'))
                    )
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': new_id})
                    }
                
                elif action == 'add_material':
                    cur.execute(
                        'INSERT INTO t_p1679283_9d_website_project.materials (title, type, size, file_url) VALUES (%s, %s, %s, %s) RETURNING id',
                        (data['title'], data['type'], data['size'], data.get('file_url'))
                    )
                    new_id = cur.fetchone()[0]
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'id': new_id})
                    }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            data = body_data.get('data')
            
            with conn.cursor() as cur:
                if action == 'update_photo':
                    cur.execute('SELECT COUNT(*) FROM t_p1679283_9d_website_project.class_info')
                    if cur.fetchone()[0] == 0:
                        cur.execute('INSERT INTO t_p1679283_9d_website_project.class_info (photo_url) VALUES (%s)', (data['photo_url'],))
                    else:
                        cur.execute('UPDATE t_p1679283_9d_website_project.class_info SET photo_url = %s', (data['photo_url'],))
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
                
                elif action == 'update_news':
                    cur.execute(
                        'UPDATE t_p1679283_9d_website_project.news SET title = %s, content = %s WHERE id = %s',
                        (data['title'], data['content'], data['id'])
                    )
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
                
                elif action == 'update_student':
                    cur.execute(
                        'UPDATE t_p1679283_9d_website_project.students SET name = %s WHERE id = %s',
                        (data['name'], data['id'])
                    )
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
                
                elif action == 'update_homework':
                    cur.execute(
                        'UPDATE t_p1679283_9d_website_project.homework SET subject = %s, task = %s, due = %s, status = %s WHERE id = %s',
                        (data['subject'], data['task'], data['due'], data.get('status', 'pending'), data['id'])
                    )
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
                
                elif action == 'update_material':
                    cur.execute(
                        'UPDATE t_p1679283_9d_website_project.materials SET title = %s WHERE id = %s',
                        (data['title'], data['id'])
                    )
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            action = params.get('action')
            item_id = params.get('id')
            
            with conn.cursor() as cur:
                if action == 'delete_news':
                    cur.execute('DELETE FROM t_p1679283_9d_website_project.news WHERE id = %s', (item_id,))
                    conn.commit()
                elif action == 'delete_student':
                    cur.execute('DELETE FROM t_p1679283_9d_website_project.students WHERE id = %s', (item_id,))
                    conn.commit()
                elif action == 'delete_homework':
                    cur.execute('DELETE FROM t_p1679283_9d_website_project.homework WHERE id = %s', (item_id,))
                    conn.commit()
                elif action == 'delete_material':
                    cur.execute('DELETE FROM t_p1679283_9d_website_project.materials WHERE id = %s', (item_id,))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True})
                }
    
    finally:
        conn.close()
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Bad request'})
    }