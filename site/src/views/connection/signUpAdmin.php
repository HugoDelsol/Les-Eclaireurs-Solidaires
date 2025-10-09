<?php
require_once "src/frontend/views/partials/_head.php";
require_once "src/frontend/views/partials/_header.php";
?>    

<main>
    <section class="register">
        <form class="form" action="index.php?page=user&action=signUpAdmin" method="post">
            <img src="/PROJET_FIL_ROUGE_GIT/projet_fil_rouge/src/frontend/pictures/login.png" alt="">
            <div class="nameRegister">
                <label><input class="marginRight" type="text" placeholder="Prénom" name="firstName" value="<?php echo empty($_POST["firstName"]) ? ""  : $_POST["firstName"] ?>"></label>
                <label><input type="text" placeholder="Nom" name="lastName" value="<?php echo empty($_POST["lastName"]) ? "" : $_POST["lastName"] ?>"></label>
            </div>
            <label><input type="email" id="email" placeholder="Email" name="email" value="<?php echo empty($_POST["email"]) ? "" : $_POST["email"] ?>"></label>
            <label><input type="password" id="password" placeholder="Mot de passe" name="password"></label>
            <label><input type="password" id="passwordConfirm" placeholder="Confirmer le mot de passe" name="passwordConfirm"></label>
            <div class="buttonLogin">
                <button type="submit" class="btnSecondary btnHover widthBtnContact">INSCRIPTION</button>
                <a href="index.php?page=user&action=signInShow">Déja inscrit ?</a>
            </div>
            <?php require_once "src/frontend/views/partials/_alert.php"; ?>
        </form>
    </section>
</main>

<?php
require_once "src/frontend/views/partials/_footer.php"
?>