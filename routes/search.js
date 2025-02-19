const FuelSolution = require('../core/domain/fuel.solution');
const SearchUseCase = require('../core/application/search.usecase');
const FuelStopService = require('../core/services/fuelstop');
const { FuelSolutionError } = require('../core/common/errors')
const Handlebars = require('handlebars');
const globalEmitter = require('../core/common/global.emitter');
const { found } = require('../core/common/constants.json')
const {
    invalid_fuel_solution,
    no_results_found
} = require('../core/templates/index');

Handlebars.registerPartial('invalid_fuel_solution', invalid_fuel_solution);
Handlebars.registerPartial('no_results_found', no_results_found);

Handlebars.registerHelper('iszero', function(value){
    return value == 0;
})

globalEmitter.on(found.unlisted_fuel_stops, unlisted_fuel_stops => {
    const service = new FuelStopService();
    return service.post(unlisted_fuel_stops);
})

async function searchRoute(request, reply) {
    const search_usecase = new SearchUseCase(
        new FuelSolution(request.body.fuel_solution)
    );

    const result = await search_usecase.execute();

    let fuel_stops_not_found = null;
    let error_parameters = {};

    if (result.not_found.length) {
        fuel_stops_not_found = result.not_found;
    }

    if (result.error && (result.error instanceof FuelSolutionError)) {
        error_parameters = {
            error_message: result.error.message,
            errors: result.error.errors.length ? result.error.errors : null,
            wiki: result.error.wiki
        };
    }

    const place_id = (result.data && result.data.length > 0) ? result.data[0].place_id : null;

    return reply.view("/src/pages/search_results.hbs", {
        place_id,
        fuel_stops: result.data,
        fuel_stops_not_found,
        ...error_parameters
    });
}

module.exports = searchRoute