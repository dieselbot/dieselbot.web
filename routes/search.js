const FuelSolution = require('../efshelper.core/domain/fuel.solution');
const SearchUseCase = require('../efshelper.core/application/search.usecase');
const FuelStopService = require('../efshelper.core/services/fuelstop');

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase();
    search_usecase.fuel_solution = new FuelSolution(request.body.fuel_solution);

    const results = await search_usecase.execute();

    if(search_usecase.missing_fuel_stops.length > 0){
        const service = new FuelStopService();
        service.post(search_usecase.missing_fuel_stops);
    }

    return reply.view("/src/pages/search_results.hbs", { results });
}

module.exports = searchRoute