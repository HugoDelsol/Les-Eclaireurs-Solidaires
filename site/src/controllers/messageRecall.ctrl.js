const jsonData = require('../config/checkBoxData.json')

exports.reminderShow = async (req, res) => {

    console.log(jsonData)
    res.render('account/admin/reminder')
}

exports.recallManagement = async (req, res) => {

    try {

        /* function removeValue(cible) {

            return function (value, index, arr) { 
                
                if (value.name === cible) {
                    arr.splice(index, 1);
                    return true;
                }
                return false;
            }
        } */

        let data = req.body

        //console.log("efef", data)

        for (let d in data) {

            //console.log("json ----",jsonData[d])
            console.log("keydata ---", data[d])

            if (data[d] == "true") {
                jsonData[d] = true
            } else {

            }
            jsonData[d] = true
            const jsonString = JSON.stringify(jsonData, null, 2)

            console.log(jsonString)



            /* if (d) {

                let string = d
                
                jsonData[d] = true
                recallIsCheckeds = true
                
                //console.log(jsonData.string)
            } else {
                jsonData.recallIsChecked = false
                recallIsCheckeds = false
            } */
        }
        console.log(jsonData)


        //console.log(jsonData)

        res.render('account/admin/reminder', {
            //recallIsChecked: recallIsCheckeds
        })

    } catch (error) {

        console.log(error)

    }
}