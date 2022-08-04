import axios from 'axios';

import { StormGlass } from '@src/clients/StormGlass';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

// Tudo que for do axios vai ser mockado
jest.mock('axios');

describe('StormGlass client', () => {
  it('Should return the normalized forecast frm the StormGlass service', async () => {
    const lat = -33.792726;
    const lgn = 151.289824;

    // Criando um mock de uma requisição GET do axios, e passado o retorno desse request.
    axios.get = jest
      .fn()
      .mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(axios);

    const response = await stormGlass.fetchPoints(lat, lgn);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
});
