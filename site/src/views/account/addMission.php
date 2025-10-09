<?php
require_once 'src/frontend/views/partials/_head.php';
?>

<main>
    <div class="container" style='display: flex;'>
        <?php require_once 'src/frontend/views/partials/_sideNavAdmin.php'; ?>
        <section class="blocAddMission">
            <h1>Créer une mission :</h1>
            <div class="line"></div>
            <form lang="fr" action="index.php?page=mission&action=addMission" method="post">
                <div class="titleCategory">
                    <label id="title">Titre de la mission :<input type="text" name="title" id="title" value="<?= empty($_POST["title"]) ? ""  : $_POST["title"] ?>" /></label>
                    <select name="category" id="category">
                        <!-- A approfondir -->
                        <?php foreach ($this->categories as $category) { ?>                        
                            <option value="<?= $category['id_mission_category'] ?>"
                                <?= ($_POST['category'] == $category['id_mission_category']) ? 'selected' : '' ?>
                                >
                                <?= htmlspecialchars($category['mission_category_name']) ?>
                            </option>
                        <?php } ?>
                    </select>
                </div>
                <label id="description">Description :<textarea type="text" name="description" value=""><?= empty($_POST["description"]) ? ""  : $_POST["description"] ?></textarea></label>
                <div class="timeDate">
                    <label id="date">Date :<input type="date" name="date"   value="<?=empty($_POST["date"]) ? ""  : $_POST["date"] ?>"/></label>
                    <label id="startTime">Heure de début :<input type="time" name="startTime"  value="<?= empty($_POST["startTime"]) ? ""  : $_POST["startTime"] ?>"/></label>
                    <label id="endTime">Heure de fin :<input type="time" name="endTime"  value="<?= empty($_POST["endTime"]) ? ""  : $_POST["time"] ?>"/></label>
                </div>
                <div class="cityPlace">
                    <label id="city">Ville :<input type="text" name="city"  value="<?= empty($_POST["city"]) ? ""  : $_POST["city"] ?>"/></label>
                    <label id="placeName">Lieu :<input type="text" name="placeName" value="<?= empty($_POST["placeName"]) ? ""  : $_POST["placeName"] ?>"/></label>
                </div>
                <div class="places">
                    <label id="spaceAvailable" class="column">Nombre de place :<input type="number" name="spaceAvailable"  value="<?= empty($_POST["spaceAvailable"]) ? ""  : $_POST["spaceAvailable"] ?>"/></label>
                    <label id="uploadImg" for="fileUpload" class="customFileUpload">Choisir une image :<input id="fileUpload" type="file" class="paddingTypeFile" name="uploadImg" value="<?= empty($_POST["uploadImg"]) ? ""  : $_POST["uploadImg"] ?>"/></label>
                </div>
                <?php require_once 'src/frontend/views/partials/_alert.php'; ?>
                <button type="submit" class="btnPrimary btnHover">PUBLIER</button>
            </form>
        </section>
    </div>
</main>

</body>

</html>