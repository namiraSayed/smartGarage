import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: any[], searchValue: string, field: string): any[] {
    if(!values) return [];
    if(!searchValue) return values;
    return values.filter((data:any) => {
      return data[field].toLowerCase().includes(searchValue.toLowerCase());
    })
  }

}
