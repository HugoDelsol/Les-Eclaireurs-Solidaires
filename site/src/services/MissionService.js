class MissionService {
    
    formatMissionStats = (data) => {

        let tabStats = [];

        let average = Math.round((data.resultSumVolunteers[0].total_next_30_days / data.resultSumPlaces[0].nbr_places) * 100);
        let averageToFixed = average.toFixed(0);

        if (averageToFixed === "NaN") {
            averageToFixed = 0;
        }

        for (let g of data.resultList) {

            const spaceAvailable = g.mission_available_place - g.nb_volunteers;
            const fillRate = (g.nb_volunteers / g.mission_available_place) * 100;

            const fillRateToString = fillRate.toFixed(0) + "%";

            tabStats.push({
                id: g.id_mission,
                mission: g.mission_title,
                date: g.mission_date,
                nbVolunteers: g.nb_volunteers,
                spaceAvailable: spaceAvailable,
                fillRate: fillRateToString,
            })
        };

        return data = {
            tabStats,
            averageToFixed,
        }
    }
}
module.exports = MissionService;