<?php

class MessageFormModel {

    private $db;

    public function __construct($db){
        $this->db = $db;
    }

    public function addMessageForm($nameForm, $emailForm, $txtAreaForm){

        try {

            $request = $this->db->prepare( "INSERT INTO message_form (name_form, email_form, message_text_form) VALUES (?, ?, ?)");
            $request->execute([$nameForm, $emailForm, $txtAreaForm]);

        } catch (PDOException $e) {

            var_dump("Error SQL" . $e->getMessage());

        }
    }


}