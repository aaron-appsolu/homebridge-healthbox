import axios from 'axios';

interface PiHoleStatus {
  status: 'enabled' | 'disabled';
}

export class PiHoleApiService {

  constructor(private piHoleUrl: string, private webPassword: string) {
  }

  public disableAdbBlocking(sec = 20): Promise<unknown> {
    return axios.get<unknown>(`${this.piHoleUrl}/admin/api.php?disable=${sec}&auth=${this.webPassword}`).then();
  }

  public status(): Promise<1 | 0> {
    return axios.get<PiHoleStatus>(`${this.piHoleUrl}/admin/api.php?status&auth=${this.webPassword}`)
      .then(axiosResponse => axiosResponse.data.status === 'enabled' ? 1 : 0);
  }
}
