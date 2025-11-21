import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { COUNTRIES, getCountryStates, formatCurrency, getUserCountry, setUserCountry, getCurrencySymbol, type CountryKey } from '@/lib/currency';

export default function TaxEstimator() {
  const defaultCountry = getUserCountry();
  const defaultState = getCountryStates(defaultCountry)[0] || '';
  const [currentCurrencySymbol, setCurrentCurrencySymbol] = useState(getCurrencySymbol(defaultCountry));
  
  const [formData, setFormData] = useState({
    grossIncome: '',
    businessExpenses: '',
    retirementContributions: '',
    healthInsurancePremiums: '',
    homeOfficeDeduction: '',
    quarter: 'Q2 (Apr-Jun 2025)',
    country: defaultCountry,
    stateProvince: defaultState,
    filingStatus: 'single',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/tax/estimate', formData);
      setResult(response.data);
      toast({
        title: 'Tax Calculated',
        description: 'Your estimated quarterly tax has been calculated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to calculate tax',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tax Estimator</h1>
        <p className="text-muted-foreground">Calculate your estimated tax obligations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Tax Calculator</CardTitle>
              <CardDescription>Enter your income and deduction details to calculate your estimated quarterly tax.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country/Region</Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => {
                        const states = getCountryStates(value);
                        setFormData({ ...formData, country: value, stateProvince: states[0] || '' });
                        setUserCountry(value);
                        setCurrentCurrencySymbol(getCurrencySymbol(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(COUNTRIES).map((country) => (
                          <SelectItem key={country} value={country}>
                            {COUNTRIES[country as CountryKey].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateProvince">State/Province</Label>
                    <Select value={formData.stateProvince} onValueChange={(value) => setFormData({ ...formData, stateProvince: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getCountryStates(formData.country).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filingStatus">Filing Status</Label>
                    <Select value={formData.filingStatus} onValueChange={(value) => setFormData({ ...formData, filingStatus: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married Filing Jointly</SelectItem>
                        <SelectItem value="head">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quarter">Quarter</Label>
                    <Select value={formData.quarter} onValueChange={(value) => setFormData({ ...formData, quarter: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Q1 (Jan-Mar 2025)">Q1 (Jan-Mar 2025)</SelectItem>
                        <SelectItem value="Q2 (Apr-Jun 2025)">Q2 (Apr-Jun 2025)</SelectItem>
                        <SelectItem value="Q3 (Jul-Sep 2025)">Q3 (Jul-Sep 2025)</SelectItem>
                        <SelectItem value="Q4 (Oct-Dec 2025)">Q4 (Oct-Dec 2025)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Income</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">{currentCurrencySymbol}</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.grossIncome}
                        onChange={(e) => setFormData({ ...formData, grossIncome: e.target.value })}
                        required
                      />
                      <Label className="text-xs text-muted-foreground">Gross Income for Quarter</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deductions</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">{currentCurrencySymbol}</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.businessExpenses}
                        onChange={(e) => setFormData({ ...formData, businessExpenses: e.target.value })}
                      />
                      <Label className="text-xs text-muted-foreground">Business Expenses</Label>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">{currentCurrencySymbol}</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.retirementContributions}
                        onChange={(e) => setFormData({ ...formData, retirementContributions: e.target.value })}
                      />
                      <Label className="text-xs text-muted-foreground">Retirement Contributions</Label>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">{currentCurrencySymbol}</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.healthInsurancePremiums}
                        onChange={(e) => setFormData({ ...formData, healthInsurancePremiums: e.target.value })}
                      />
                      <Label className="text-xs text-muted-foreground">Health Insurance Premiums</Label>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">{currentCurrencySymbol}</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.homeOfficeDeduction}
                        onChange={(e) => setFormData({ ...formData, homeOfficeDeduction: e.target.value })}
                      />
                      <Label className="text-xs text-muted-foreground">Home Office Deduction</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate Estimated Tax'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tax Summary</CardTitle>
              <CardDescription>
                {result ? 'Enter your income and deduction details to calculate your estimated quarterly tax.' : 'Your calculated tax estimate will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center rounded-lg bg-muted p-6">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Quarterly Taxable Income</span>
                      <span className="text-sm font-medium">{formatCurrency(parseFloat(result.quarterlyTaxableIncome), formData.country)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Annual Income</span>
                      <span className="text-sm font-medium">{formatCurrency(parseFloat(result.estimatedAnnualTaxableIncome), formData.country)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Annual Tax</span>
                      <span className="text-sm font-medium">{formatCurrency(parseFloat(result.estimatedAnnualTax), formData.country)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Estimated Quarterly Tax</span>
                        <span className="text-xl font-bold text-primary">{formatCurrency(parseFloat(result.estimatedQuarterlyTax), formData.country)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Enter your income and deduction details to calculate your estimated quarterly tax.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}