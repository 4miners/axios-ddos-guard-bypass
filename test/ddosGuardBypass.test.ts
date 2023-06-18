import { ddosGuardBypass } from '../src/index';
import axios from 'axios';
import { CookieJar, Cookie } from 'tough-cookie';

describe('DdosGuardBypass', () => {
  let serviceUrl = 'https://ddos-guard.net';
  let headers = {
    Referer: serviceUrl
  };

  it('should bypass DDoS Guard when no CookieJar provided', async () => {
    let agent = axios.create();

    ddosGuardBypass(agent);

    for (let index = 0; index < 5; index++) {
      console.log(`Sending req ${index + 1}`);
      let response = await agent({
        url: serviceUrl,
        headers: headers
      });

      expect(response.status).toBe(200);
      expect(response.config.jar).toBeInstanceOf(CookieJar);

      let expectedCookie = '__ddg1_';
      const cookies = response.config.jar?.getCookiesSync(serviceUrl) || [];

      const found = cookies.find((cookie) => cookie.key === expectedCookie);
      expect(found).toBeInstanceOf(Cookie);
    }
  }, 20000);

  it('should bypass DDoS Guard when custom CookieJar provided', async () => {
    let cookieJar = new CookieJar();
    let agent = axios.create({
      jar: cookieJar
    });

    ddosGuardBypass(agent);

    for (let index = 0; index < 5; index++) {
      console.log(`Sending req ${index + 1}`);
      let response = await agent({
        url: serviceUrl,
        headers: headers
      });

      expect(response.status).toBe(200);
      expect(response.config.jar).toBeInstanceOf(CookieJar);

      let expectedCookie = '__ddg1_';
      const cookies = response.config.jar?.getCookiesSync(serviceUrl) || [];

      const found = cookies.find((cookie) => cookie.key === expectedCookie);
      expect(found).toBeInstanceOf(Cookie);
    }
  }, 20000);

  it('should bypass DDoS Guard when baseURL is used', async () => {
    let agent = axios.create({
      baseURL: serviceUrl
    });

    ddosGuardBypass(agent);

    for (let index = 0; index < 5; index++) {
      console.log(`Sending req ${index + 1}`);
      let response = await agent({
        headers: headers
      });

      expect(response.status).toBe(200);
      expect(response.config.jar).toBeInstanceOf(CookieJar);

      let expectedCookie = '__ddg1_';
      const cookies = response.config.jar?.getCookiesSync(serviceUrl) || [];

      const found = cookies.find((cookie) => cookie.key === expectedCookie);
      expect(found).toBeInstanceOf(Cookie);
    }
  }, 20000);
});
