import {CharacteristicValue, PlatformAccessory, Service} from 'homebridge';
import {HealthBoxHomebridgePlatform} from './platform';
import {PiHoleApiService} from './pi-hole-api-service';


export class PiHoleAccessory {
  private service: Service;
  private piHoleApiService: PiHoleApiService;

  private state = {
    piHoleIp: '192.168.1.1',
    webPassword: '',
  };

  constructor(
    private readonly platform: HealthBoxHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.piHoleApiService = new PiHoleApiService(accessory.context.piHoleIp, accessory.context.webPassword);
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Raspberry Pi')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, this.state.piHoleIp);

    this.service = this.accessory.getService(this.platform.Service.Switch)
      || this.accessory.addService(this.platform.Service.Switch);


    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onGet(this.statusPiHole.bind(this))
      .onSet(this.setPiHole.bind(this));
  }

  async setPiHole(value: CharacteristicValue) {
    await this.piHoleApiService.setAdbBlocking(value as boolean, 20);
  }

  async statusPiHole(): Promise<CharacteristicValue> {
    return await this.piHoleApiService.status();
  }
}
