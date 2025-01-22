const FuelSolution = require('../core/domain/fuel.solution');
const SearchUseCase = require('../core/application/search.usecase');
const FuelStopService = require('../core/services/fuelstop');

const globalEmitter = require('../core/common/global.emitter');

globalEmitter.on('insert:unlisted_fuel_stops', unlisted_fuel_stops => {
    const service = new FuelStopService();
    return service.post(unlisted_fuel_stops);
})

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase(
        new FuelSolution(request.body.fuel_solution)
    );
    
    const result = await search_usecase.execute();

    if(!result.success){
        console.warn(result.message);
        return reply.view("/src/pages/search_results.hbs");
    }

    return reply.view("/src/pages/search_results.hbs", { data: result.data });
}

module.exports = searchRoute