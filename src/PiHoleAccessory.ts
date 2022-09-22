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
      .onGet(this.status.bind(this))
      .onSet(this.disable.bind(this));
  }

  async disable() {
    await this.piHoleApiService.disableAdbBlocking(20);
  }

  async status(): Promise<CharacteristicValue> {
    return await this.piHoleApiService.status();
  }
}
