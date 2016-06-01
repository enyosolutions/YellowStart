
<!DOCTYPE html>
<html lang="{{ locale }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">

    {# Cette ligne créer un favicon vide pour éviter les 404 #}
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />

    <title>{% block title %}{{ 'global.title' }}{% endblock %}</title>

    {% block stylesheets %}
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">
        <link href='https://fonts.googleapis.com/css?family=Kaushan+Script' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet'
              type='text/css'>
        <link rel="stylesheet" type="text/css" href="/compiled/styles.css" />
    {% endblock stylesheets %}

    {% block top_javascripts %}
        <!--[if lt IE 9]>
        <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    {% endblock %}
</head>
<body {% if page.id is defined %}id="{{ page.id }}"{% endif %}{% if page.class is defined %} class="{% for class in page.class %}{{ class }} {% endfor %}"{% endif %}>
{#
  Le block container_content sera surchargé dans tous les autres template.
  Le fichier layout.html.twig doit contient tout ce qui est commun à tout le site.
  Ce commentaire ne sera pas présent dans la page HTML.
#}

{% block topnav %}

{% endblock %}

{% block container_content %}{% endblock %}

{%- block javascripts %}
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <script src="/js/script.js"></script>
{%- endblock -%}
</body>
</html>