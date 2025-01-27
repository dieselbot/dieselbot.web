const FuelSolution = require('../core/domain/fuel.solution');
const SearchUseCase = require('../core/application/search.usecase');
const FuelStopService = require('../core/services/fuelstop');
const { FuelSolutionError } = require('../core/common/errors')
const Handlebars = require('handlebars');
const globalEmitter = require('../core/common/global.emitter');
const { found } = require('../core/common/constants.json')
const {
    invalid_fuel_solution,
    no_results_found,
    search_results
} = require('../core/templates/index');

Handlebars.registerPartial('invalid_fuel_solution', invalid_fuel_solution);
Handlebars.registerPartial('no_results_found', no_results_found);
Handlebars.registerPartial('search_results', search_results);

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
        fuel_stops_not_found = result.not_found.map(fuel_stop => fuel_stop.toString());
    }

    if (result.error && (result.error instanceof FuelSolutionError)) {
        error_parameters = {
            error_message: result.error.message,
            errors: result.error.errors.length ? result.error.errors : null,
            wiki: result.error.wiki
        };
    }

    return reply.view("/src/pages/search_results.hbs", {
        fuel_stops: result.data,
        fuel_stops_not_found,
        ...error_parameters
    });
}

module.exports = searchRoute