class Utils {

    clearData(missions, valueSpace) {

        let tabResult = [];

        for (let i = 0; i < missions.length; i++) {

            if (valueSpace !== undefined && valueSpace[i]) {

                let data = {

                    id: missions[i].id_mission,
                    img: missions[i].mission_img,
                    title: missions[i].mission_title,
                    description: missions[i].mission_description.split(" ").slice(0, 30).join(" "),
                    category: missions[i].mission_category_name,
                    city: missions[i].city_name,
                    places: missions[i].mission_available_place - valueSpace[i],
                    date: missions[i].mission_date,
                }

                tabResult.push(data);

            } else {

                let data = {

                    id: missions[i].id_mission,
                    img: missions[i].mission_img,
                    title: missions[i].mission_title,
                    description: missions[i].mission_description.split(" ").slice(0, 30).join(" "),
                    category: missions[i].mission_category_name,
                    city: missions[i].city_name,
                    places: missions[i].mission_available_place,
                    date: missions[i].mission_date,
                }

                tabResult.push(data);
            }
        }

        return tabResult;
    }

    randomImage(fetchGroupImages) {

        let resultImgUrl = null;

        const randomImg = Math.floor(Math.random() * fetchGroupImages.length);

        if (randomImg === 0) {

            resultImgUrl = "https://www.saint-brieuc.bzh/fileadmin/_processed_/c/3/csm_lanterne_pour_la_paix_930950d0f8.jpg"
        } else {

            resultImgUrl = fetchGroupImages[randomImg].mission_image_url;
        }

        return resultImgUrl;
    }
}
module.exports = Utils;


