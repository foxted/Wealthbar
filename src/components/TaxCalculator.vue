<template>
    <el-container>
        <el-col>
            <el-row :gutter="20">
                <h1>TFSA vs. RRSP</h1>
                <el-col :span="18" :offset="3" align="left">
                    <el-form label-position="top">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="Current Marginal Tax Rate">
                                    <el-input type="number"
                                              :min="0"
                                              :max="100"
                                              :precision="2"
                                              :step="0.1"
                                              v-model="form.currentMarginalTaxRate"
                                    >
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Average Tax Rate in Retirement">
                                    <el-input type="number"
                                              :min="0"
                                              :max="100"
                                              :step="0.10"
                                              v-model="form.retirementAverageTaxRate"
                                    >
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Deposit Amount">
                                    <el-input type="number"
                                              :min="0"
                                              :step="1"
                                              v-model="form.depositAmount"
                                    >
                                        <template slot="append">$</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="Years Invested">
                                    <el-input type="number"
                                              :min="1"
                                              :step="1"
                                              v-model="form.yearsInvested"
                                    >
                                        <template slot="append">year(s)</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Return on Investment">
                                    <el-input type="number"
                                              :min="1"
                                              :max="100"
                                              :step="0.1"
                                              v-model="form.returnOnInvestment"
                                    >
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="Inflation Rate">
                                    <el-input type="number"
                                              :min="1"
                                              :max="100"
                                              :step="0.1"
                                              v-model="form.inflationRate"
                                    >
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
                <el-col :span="18" :offset="3">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="header"></el-table-column>
                        <el-table-column prop="tfsa"
                                         label="TFSA"
                                         width="180">
                        </el-table-column>
                        <el-table-column prop="rrsp"
                                         label="RRSP"
                                         width="180">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-col>
    </el-container>
</template>

<script>
import { formatMoney, formatPercentage } from '@/utilities/formatting';

export default {
    data() {
        return {
            form: {
                currentMarginalTaxRate: 38.29,
                retirementAverageTaxRate: 31,
                depositAmount: 1000,
                yearsInvested: 30,
                returnOnInvestment: 6,
                inflationRate: 2.5
            }
        };
    },
    computed: {
        tableData() {
            return [
                {
                    header: 'Pre-Tax Dollars',
                    tfsa: this.formatMoney(this.form.depositAmount),
                    rrsp: this.formatMoney(this.form.depositAmount),
                },
                {
                    header: `Tax (${this.formatPercentage(this.form.currentMarginalTaxRate)})`,
                    tfsa: this.formatMoney(this.taxAmountTFSA),
                    rrsp: this.formatMoney(this.taxAmountRRSP),
                },
                {
                    header: 'After-Tax Dollars',
                    tfsa: this.formatMoney(this.amountAfterTaxTFSA),
                    rrsp: this.formatMoney(this.amountAfterTaxRRSP),
                },
                {
                    header: 'Future Value',
                    tfsa: this.formatMoney(this.futureBeforeTaxValueTFSA),
                    rrsp: this.formatMoney(this.futureBeforeTaxValueRRSP),
                },
                {
                    header: `Future Tax Paid (${this.formatPercentage(this.form.retirementAverageTaxRate)})`,
                    tfsa: this.formatMoney(this.futureTaxValueTFSA),
                    rrsp: this.formatMoney(this.futureTaxValueRRSP),
                },
                {
                    header: 'After Tax Future Value',
                    tfsa: this.formatMoney(this.futureAfterTaxValueTFSA),
                    rrsp: this.formatMoney(this.futureAfterTaxValueRRSP),
                }
            ];
        },
        returnOnInvestment() {
            return this.form.returnOnInvestment / 100;
        },
        inflationRate() {
            return this.form.inflationRate / 100;
        },
        realRateOfReturn() {
            if (this.inflationRate === 0) {
                return this.returnOnInvestment;
            }

            return ((1 + this.returnOnInvestment) / (1 + this.inflationRate)) - 1;
        },
        taxAmountTFSA() {
            return this.form.depositAmount * (this.form.currentMarginalTaxRate / 100);
        },
        taxAmountRRSP() {
            return 0;
        },
        amountAfterTaxRRSP() {
            return this.form.depositAmount;
        },
        amountAfterTaxTFSA() {
            return this.form.depositAmount - this.taxAmountTFSA;
        },
        futureBeforeTaxValueTFSA() {
            return this.futureValue(this.amountAfterTaxTFSA);
        },
        futureBeforeTaxValueRRSP() {
            return this.futureValue(this.amountAfterTaxRRSP);
        },
        futureTaxValueTFSA() {
            return 0;
        },
        futureTaxValueRRSP() {
            return this.futureBeforeTaxValueRRSP * this.form.retirementAverageTaxRate / 100;
        },
        futureAfterTaxValueTFSA() {
            return this.futureBeforeTaxValueTFSA - this.futureTaxValueTFSA;
        },
        futureAfterTaxValueRRSP() {
            return this.futureBeforeTaxValueRRSP - this.futureTaxValueRRSP;
        },
    },
    methods: {
        formatMoney,
        formatPercentage,
        futureValue(capital) {
            return capital * Math.pow(1 + this.realRateOfReturn, this.form.yearsInvested);
        },
    }
};
</script>

<style lang="scss">
    .el-input-number {
        width: auto;

        &.is-controls-right .el-input__inner {
            padding-left: 0;
        }
    }
</style>
