import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function InvestorComboBox() {
  const options = typesOfInvestors.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  return (
    <Autocomplete
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.title}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Click to select investor type" />}
    />
  );
}

const typesOfInvestors = [
    { title: 'Individual Investors (Retail Investors)', description: 'Individuals who invest personal savings in stocks, bonds, mutual funds, or other assets.' },
    { title: 'Institutional Investors', description: 'Large organizations that invest on behalf of others, such as pension funds, insurance companies, and mutual funds.' },
    { title: 'Angel Investors', description: 'High-net-worth individuals who provide capital to startups or early-stage companies in exchange for equity.' },
    { title: 'Venture Capitalists (VCs)', description: 'Firms or individuals that invest in high-growth startups and early-stage companies with significant potential.' },
    { title: 'Private Equity Investors', description: 'Firms that invest in private companies or buy out public companies to take them private.' },
    { title: 'Hedge Funds', description: 'Pooled investment funds that use aggressive strategies to generate high returns.' },
    { title: 'Mutual Funds', description: 'Investment vehicles that pool money from multiple investors to invest in a diversified portfolio.' },
    { title: 'Exchange-Traded Funds (ETFs)', description: 'Similar to mutual funds but traded on stock exchanges like individual stocks.' },
    { title: 'Real Estate Investors', description: 'Individuals or firms that invest in properties for rental income, resale, or development.' },
    { title: 'Day Traders', description: 'Individuals who buy and sell securities within the same day to capitalize on short-term price movements.' },
    { title: 'Swing Traders', description: 'Investors who hold positions for several days or weeks to profit from medium-term price trends.' },
    { title: 'Value Investors', description: 'Investors who seek undervalued stocks or assets trading below their intrinsic value.' },
    { title: 'Growth Investors', description: 'Investors who focus on companies with high growth potential, even if they are currently overvalued.' },
    { title: 'Dividend Investors', description: 'Investors who prioritize companies that pay regular dividends for income over capital appreciation.' },
    { title: 'Impact Investors', description: 'Investors who focus on generating social or environmental impact alongside financial returns.' },
    { title: 'Socially Responsible Investors (SRI)', description: 'Investors who avoid industries like tobacco or fossil fuels and prioritize ESG practices.' },
    { title: 'Speculators', description: 'Investors who take high-risk positions in assets to profit from price volatility.' },
    { title: 'Crowdfunding Investors', description: 'Individuals who invest small amounts in startups or projects through crowdfunding platforms.' },
    { title: 'Accredited Investors', description: 'Individuals or entities that meet specific income or net worth requirements to invest in unregulated securities.' },
    { title: 'Family Offices', description: 'Private wealth management firms that handle investments for ultra-high-net-worth families.' },
    { title: 'Sovereign Wealth Funds', description: 'State-owned investment funds that manage a country’s reserves.' },
    { title: 'Corporate Investors', description: 'Companies that invest in other businesses for strategic partnerships or diversification.' },
    { title: 'Micro-Investors', description: 'Individuals who invest small amounts through apps or platforms with low minimum investments.' },
    { title: 'Algorithmic/Quantitative Investors', description: 'Investors who use computer algorithms and quantitative models to make investment decisions.' },
    { title: 'Peer-to-Peer (P2P) Lenders', description: 'Individuals or platforms that lend money directly to borrowers, bypassing traditional financial institutions.' },
    { title: 'Commodity Traders', description: 'Investors who trade in physical commodities or commodity derivatives.' },
    { title: 'Forex Traders', description: 'Investors who specialize in trading currencies on the foreign exchange market.' },
    { title: 'Cryptocurrency Investors', description: 'Investors who trade or hold digital assets like Bitcoin or Ethereum.' },
    { title: 'Distressed Debt Investors', description: 'Investors who invest in the debt of companies facing financial difficulties.' },
    { title: 'Index Investors', description: 'Passive investors who buy index funds or ETFs that track market indices.' },
    { title: 'Robo-Advisors', description: 'Automated platforms that create and manage diversified portfolios for investors.' },
    { title: 'Retail Traders', description: 'Individual investors who trade securities through online platforms without professional guidance.' },
    { title: 'High-Frequency Traders (HFT)', description: 'Investors who use advanced algorithms to execute trades at extremely high speeds.' },
    { title: 'Arbitrageurs', description: 'Investors who exploit price differences of the same asset in different markets.' },
    { title: 'Insiders', description: 'Company executives, directors, or employees who invest in their own company’s stock.' },
  ];
