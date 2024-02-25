---
title: "Margin Procyclicality in Derivatives Markets"
date: 2024-02-19
description: "A summary of my Bachelor Thesis in Economics about Margin Procyclicality of listed derivatives"

---
# Purpose
This post describes the motivation and the results behind my bachelor Thesis titled *Margin Procyclicality
during Covid 19 - Drivers, Impact and Solutions*. It is described how outbursts of volatility in financial markets
can result in sharp spikes of margin requirements at Central Counterparties (CCPs) which may lead to financial instabilities.
    This has brought regulators to discuss potential remedies to tackle the problem. Those solutions are discussed and analyzed at
the example of a margin model as applied to a single-instrument portfolio (FESX future) which shows that different approaches
come with their own set of advantages and disadvantages.

# Margin in Derivatives Markets
After the financial crisis in 2008, regulators started imposing central clearing mandates on many derivatives transactions.
Central clearing reduces the complex web between counterparties in OTC markets to a single exposure towards a central
clearing party. In turn, this leads to a concentration in risk at one single node in the system, as the CCP guarantees
the fulfilment of every transaction it clears.

<img src="/src/assets/images/ccp_clearing.png">

Thus, CCPs are highly regulated entities and are subject to certain rules, eg.
regarding their margining practices. The collection of margin by CCPs is often procyclical (ie. increases with financial market volatility).
This means that at times when market parcicipants' liquidity may already be strained, a sharp increase in margin demands from CCPs (which must often be in highly liquid assets)
may lead to fire sales and downward spirals in asset prices which further reduces the value of existing collateral and further fuels the downwards spiral. 

# CCP Risk Management
In total, the 5 largest clearing houses have almost 1 trillion USD in deposited collateral which highlights their systemic importance in the global financial markets landscape. 

| Name           | Popular Products                                    | Collateral   |
|----------------|-----------------------------------------------------|--------------|
| LCH.Clearnet   | CDS, NDF-Forex, IRS, Equity (via LSE), Repo         | 330 Bio. USD |
| ICE Clear      | Coffee, Sugar, Brent /WTI Crude Oil, CDS            | 250 Bio. USD |
| CME Clearing   | Eurodollar, S&P 500 E-mini, Natural Gas, 10Y T-Note | 207 Bio. USD |
| OCC            | Cboe VIX, Equity Derivatives                        | 136 Bio. USD |
| Eurex Clearing | Bund, EuroStoxx50, IRS, Equities (via XETRA & FWB)  | 132 Bio. USD |

To make CCPs as 'fail-safe' as possible, various bodies supervise and regulate CCPs, such as ESMA in Europe or the CFTC in the US with primary regulation 
found in EMIR (European Market Infrastructure Regulation) in the EU as well as international standards such as the *Principles for Fiancial Market Infrastructures* (PFMI).
To shield themselves from a potential default of one of their members, CCPs generally resort to three different 'categories' of securities they demand from their members.
The two most important being initial - and variation margin. 

## Variation Margin
Variation Margin is the backward-looking component of Margin which ensures that all open positions at the CCP are marked to market. Variaion Margin (VM) is typically called for 
at the end of the day and ensures that the CCP has zero open exposure to its clients at the opening of every new day.
In the case of future-style settled instruments such as most financial futures or IRS, VM is not held by the CCP but is passed through from one side of the contract ot the other to settle daily profits and losses.

## Initial Margin
In contrast to VM, initial Margin (IM) is a forward-looking component that acts as a buffer for future prices changes and protects the clearing house from 
any possible losses of a defaulted counterparty between the time of their default and the unwinding of their positions.

According to EMIR, initial margin must be calibrated to cover 99% (99.5% for OTC-instruments) of all potential 2-day (5-day) losses of members' portfolios. (ie IM = 99%/99.5% VaR)
This gives the CCP enough time to orderly liquidate a defaulted member's portfolio without risking its own assets. 

Initial Margin --> Most often considered when talking about procyclicality (mention below)
## Default Fund & Add-Ons

## Margin Calls

## Collateral 

## APC Regulation in EMIR
1. Margin Buffer of at least 25% which can be temporarily exhausted when margin requirements are rising significantly
2. Assigning at least 25% weight to stressed observations in the lookback period
3. Ensuring that margin requirements are no lower than those that would be calculated using volatility estimated over a 10-year 
historical lookback period

# Margin Procyclicality during Covid 19
<div class="img_container">
<img src="/src/assets/images/ewma_1d_FESX.svg">
<img src="/src/assets/images/daily_returns_FESX.svg">
</div>

<img style="width: 100%;" src="/src/assets/images/APC_comparison_long.svg">

<img style="width: 100%;" src="/src/assets/images/LTM_stress_periods_long.svg">


<img style="width: 100%;" src="/src/assets/images/LTM_stress_periods_long.svg">
<img style="width: 100%;" src="/src/assets/images/release_levels_long.svg">

## Margin Model 

$$\alpha + \beta$$
$$IM(\tau) = VaR_{\rho}(PnL_i) * \lambda$$

$$PnL_i = (\hat{r_i (\tau)}$$
$$\hat{r_i(tau)} = (\hat{r_i (\tau)}$$
$$\hat{r_i(tau)} = (\hat{r_i (\tau)}$$



