const FuelSolution = require('../core/domain/fuel.solution');
const SearchUseCase = require('../core/application/search.usecase');
const FuelStopService = require('../core/services/fuelstop');

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase(
        new FuelSolution(request.body.fuel_solution)
    );
    
    const result = await search_usecase.execute();

    if(!result.success){
        console.warn(result.message);
        return reply.view("/src/pages/search_results.hbs");
    }

    if (search_usecase.new_fuel_stops.length > 0) {
        const service = new FuelStopService();
        service.post(search_usecase.new_fuel_stops);
    }

    return reply.view("/src/pages/search_results.hbs", { data: result.data });
}

module.exports = searchRoute