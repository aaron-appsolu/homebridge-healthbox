import axios from 'axios';

interface PiHoleStatus {
  status: 'enabled' | 'disabled';
}

export class PiHoleApiService {

  constructor(private piHoleUrl: string, private webPassword: string) {
  }

  public setAdbBlocking(status: boolean, sec = 20): Promise<PiHoleStatus> {
    const endpoint = status ? 'enable' : `disable=${sec}`;
    return axios.get<PiHoleStatus>(`${this.piHoleUrl}/admin/api.php?${endpoint}&auth=${this.webPassword}`).then();
  }

  public status(): Promise<1 | 0> {
    return axios.get<PiHoleStatus>(`${this.piHoleUrl}/admin/api.php?status&auth=${this.webPassword}`)
      .then(axiosResponse => axiosResponse.data.status === 'enabled' ? 1 : 0);
  }
}
