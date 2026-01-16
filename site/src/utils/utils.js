exports.clearData = (missions) => {

    return missions.map(m => ({
        id: m.id_mission,
        img: m.mission_img,
        title: m.mission_title,
        description: m.mission_description.split(" ").slice(0, 30).join(" "),
        category: m.mission_category_name,
        places: m.mission_available_place,
        date: m.mission_date
    }))  
}

exports.randomImage = (fetchGroupImages) => {

    let resultImgUrl = null;

    const randomImg = Math.floor(Math.random() * fetchGroupImages.length);

    if (randomImg === 0) {

        resultImgUrl = "https://www.saint-brieuc.bzh/fileadmin/_processed_/c/3/csm_lanterne_pour_la_paix_930950d0f8.jpg"
    } else {

        resultImgUrl = fetchGroupImages[randomImg].mission_image_url;
    }

    return resultImgUrl;
}