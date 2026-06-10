<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Admin Panel</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<div class="content">

<!-- LOGIN -->
<div id="login">
  <h2>Connexion Admin</h2>
  <input id="user" placeholder="Username"><br><br>
  <input id="pass" type="password" placeholder="Password"><br><br>
  <button onclick="login()">Connexion</button>
</div>

<!-- PANEL -->
<div id="panel" style="display:none">

  <h2>Dashboard 3D Portfolio</h2>

  <h3>➕ Ajouter Modèle 3D</h3>
  <input id="ptitle" placeholder="Nom du modèle"><br><br>
  <input id="pdesc" placeholder="Description"><br><br>
  <button onclick="addProject()">Ajouter</button>

  <hr>

  <h3>💬 Ajouter Feedback</h3>
  <input id="fuser" placeholder="User"><br><br>
  <input id="ftext" placeholder="Message"><br><br>
  <button onclick="addFeedback()">Ajouter</button>

</div>

</div>

<script src="data.js"></script>
<script src="admin.js"></script>
</body>
</html>
