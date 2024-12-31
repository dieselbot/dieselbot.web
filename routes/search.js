const FuelSolution = require('../efshelper.core/domain/fuel.solution');
const SearchService = require('../efshelper.core/services/search');
const SearchUseCase = require('../efshelper.core/application/search.usecase');
const { FUEL_STOP_FOUND_CHANNEL } = require('../efshelper.core/common/constants.json')

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase();
    search_usecase.fuel_solution = new FuelSolution(request.body.fuel_solution);
    search_usecase.search_service = new SearchService();
    const params = {
        results: await search_usecase.execute()
    }
    
    await request.redisClient.publish(FUEL_STOP_FOUND_CHANNEL, JSON.stringify(params.results));

    return reply.view("/src/pages/search_results.hbs", params);
}

module.exports = searchRoute