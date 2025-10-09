<?php if ($this->alertSuccess) { ?>
    <div style="color: green;">        
        <?=  $this->alertSuccess ?>
    </div>
<?php } ?>
<?php if ($this->alertError) { ?>
    <div style="color: red; ">
        <?= $this->alertError ?>
    </div>
<?php } ?>