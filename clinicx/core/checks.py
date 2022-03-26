from django.db import connections


def check_database_connections():
    for name in connections:
        cursor = connections[name].cursor()
        cursor.execute('SELECT 1;')
        row = cursor.fetchone()
        if row is None:
            raise ValueError(f'Expecting a record. Is {name} database down?')


HEALTH_CHECKS = (
    check_database_connections,
)
