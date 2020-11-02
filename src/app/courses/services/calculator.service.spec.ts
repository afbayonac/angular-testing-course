import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('Calculator service', () => {
  let loggerSpy: any;
  let calculator: CalculatorService;


  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });
    calculator = TestBed.inject(CalculatorService);
  });

  it('Add two numbers', () => {
    const result = calculator.add(2, 2);
    expect(result).toEqual(4, 'unexpect result');
  });

  it('Subtrac two numbers', () => {
    const result = calculator.subtract(2, 2);
    expect(result).toEqual(0, 'unexpect result');
  });

  afterAll(() => {
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
