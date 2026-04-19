import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string,length:number, ...args: unknown[]): string {
    if(length===0) return value;
    return value.slice(0,length+1).concat('...');
  }
}
