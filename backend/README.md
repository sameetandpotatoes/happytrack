# Happytrack Backend

## Prereqs

To install and run, we recommend virtualenvironments.
```console
$ virtualenv -p python3.5 env/
$ source env/bin/activate
(env) $
```

Then install the prereqs

```console
(env) $ pip install -r requirements.txt
```

## Running the application

To see the application with data, try this

```console
(env) $ python3 manage.py shell < seed.py
```

To run the application try

```console
(env) $ python3 manage.py runserver
```

