import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxonomy',
})
export class TaxonomyPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
