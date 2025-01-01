const FuelSolution = require('../efshelper.core/domain/fuel.solution');
const SearchService = require('../efshelper.core/services/search');
const SearchUseCase = require('../efshelper.core/application/search.usecase');
const FuelStopService = require('../efshelper.core/services/fuelstop');

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase();
    search_usecase.fuel_solution = new FuelSolution(request.body.fuel_solution);
    search_usecase.search_service = new SearchService();
    const fuel_stop_service = new FuelStopService();

    const results = await search_usecase.execute();
    
    // await this.redisClient.publish(FUELSTOP.FOUND, JSON.stringify(results));

    fuel_stop_service.post(results);

    return reply.view("/src/pages/search_results.hbs", { results });
}

module.exports = searchRoute