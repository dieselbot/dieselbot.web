const FuelSolution = require('../efshelper.core/domain/fuel.solution');
const SearchService = require('../efshelper.core/services/search');
const SearchUseCase = require('../efshelper.core/application/search.usecase');
const { FUELSTOP } = require('../efshelper.core/common/constants.json')

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase();
    search_usecase.fuel_solution = new FuelSolution(request.body.fuel_solution);
    search_usecase.search_service = new SearchService();
    
    const results = await search_usecase.execute();
    
    await this.redisClient.publish(FUELSTOP.FOUND, JSON.stringify(results));

    return reply.view("/src/pages/search_results.hbs", { results });
}

module.exports = searchRoute