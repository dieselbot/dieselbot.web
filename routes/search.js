const read_fuel_solution = require('../efshelper.core/common/read_fs');
const SearchService = require('../efshelper.core/services/search');

async function searchRoute(request, reply) {
    let search_phrases = read_fuel_solution(request.body.fuel_solution)
    const searchService = new SearchService();
    const result = await searchService.findPlaces(search_phrases);
    const params = {
        results: result
    }
    return reply.view("/src/pages/search_results.hbs", params);
}

module.exports = searchRoute