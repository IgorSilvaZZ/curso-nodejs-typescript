import axios from 'axios';
import * as HTTPUtil from '@src/util/Request';

import { StormGlass } from '@src/clients/StormGlass';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

// Tudo que for do axios vai ser mockado
jest.mock('@src/util/Request');

describe('StormGlass client', () => {
  // Adicionando os tipos de axios no mocked do jest
  // Assim conseguindo utilizar os dois tipos dentro dessa variavel
  /* const mockedAxios = axios as jest.Mocked<typeof axios>; */
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('Should return the normalized forecast frm the StormGlass service', async () => {
    const lat = -33.792726;
    const lgn = 151.289824;

    // Criando um mock de uma requisição GET do axios, e passado o retorno desse request.
    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lgn);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lgn = 151.289824;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2022-08-09T00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lgn);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lgn = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'NetWork Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lgn)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: NetWork Error'
    );
  });

  it('should get an StormGlassReponseError when the StormGlass service repose with error', async () => {
    const lat = -33.792726;
    const lgn = 151.289824;

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lgn)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
