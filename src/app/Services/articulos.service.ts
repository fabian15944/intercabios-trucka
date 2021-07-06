import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'

})
export class ArticulosService {
  url: string;
  articulo: any;

  constructor(private http: HttpClient,
  ) {
    this.url = environment.urlbackend;
  }

  getArticulos(Marca): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + `articulos/${Marca}`).subscribe(Data => {    
        this.articulo = Data;
        resolve();

      }, err => {
        console.log('error', err);
        reject()
      });

    });


  }
  

}
