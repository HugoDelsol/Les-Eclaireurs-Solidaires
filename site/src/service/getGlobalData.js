const missionModel = require('../models/MissionModel');

exports.categories = async () => {

    //helpers

    //call helper for bdd and return data

    let allCategories = await missionModel.getAllCategories();

    let dataTab = [];

    for (let category of allCategories) {

        let data = {

            categoryId: category.id_mission_category,
            categoryName: category.mission_category_name
        }

        dataTab.push(data)

    } 

    return dataTab

}

exports.region = async () => {

    const allRegion = await missionModel.getAllRegions();

    //console.log(allRegion)

    return allRegion
}