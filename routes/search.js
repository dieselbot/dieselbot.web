const FuelSolution = require('../efshelper.core/domain/fuel.solution');
const SearchService = require('../efshelper.core/services/search');
const SearchUseCase = require('../efshelper.core/application/search.usecase');
const { FUEL_STOP_FOUND_CHANNEL } = require('../efshelper.core/common/constants.json')
const { createClient } = require('../efshelper.core/node_modules/redis');

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase();
    search_usecase.fuel_solution = new FuelSolution(request.body.fuel_solution);
    search_usecase.search_service = new SearchService();
    const params = {
        results: await search_usecase.execute()
    }

    const client = createClient();
        
    await client.connect();
    
    await client.publish(FUEL_STOP_FOUND_CHANNEL, JSON.stringify(params.results));
    
    await client.disconnect()

    return reply.view("/src/pages/search_results.hbs", params);
}

module.exports = searchRoute