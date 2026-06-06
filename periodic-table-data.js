/* ============================================================
   PERIODIC TABLE OF BLACK WOMEN IN STEM — roster data
   ------------------------------------------------------------
   Concept & original artwork: Chem Thug (chemthug.dashery.com).
   This page is a tribute/companion project — every cell starts
   GHOSTED and lights up when Webs publishes a research artifact
   (video, write-up, etc.) about that woman.

   HOW TO LIGHT ONE UP
   -------------------
   Find her entry below and:
     1. set  status: 'lit'
     2. fill  bio:  '...your write-up...'
     3. fill  artifact: 'https://...link to your video/post...'
   Then commit + push. Vercel redeploys and her cell glows.

   FIELDS
     n        number printed on the shirt (1-82)
     symbol   the element-style abbreviation
     name     her name
     years    birth–death (or 'b. YYYY'); '' if unknown
     field    discipline key -> drives the cell color (see FIELDS legend in HTML)
              one of: biology | chemistry | mathematics | physics |
                      engineering | computerScience | socialScience |
                      earthScience | innovation | medicine
     status   'ghosted' (default) | 'lit'
     bio      write-up shown in the pop-up (only needed once lit)
     artifact url to the finished artifact (only needed once lit)
     verify   true = transcribed from a partly-obscured shirt photo;
              double-check the name/spelling/field against the shirt.
   ============================================================ */

window.STEM_DATA = [
  { n: 1,  symbol: 'REM',  name: 'Ruth Ella Moore',          years: '1903–1994', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 2,  symbol: 'MPC',  name: 'Mamie Phipps Clark',       years: '1917–1983', field: 'socialScience',  status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 3,  symbol: 'MCJ',  name: 'Mae C. Jemison',           years: 'b. 1956',   field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 4,  symbol: 'KJ',   name: 'Katherine Johnson',        years: '1918–2020', field: 'mathematics',
    status: 'lit',
    bio: 'Mathematician at NASA whose hand calculations of orbital mechanics were critical to the first U.S. crewed spaceflights. John Glenn famously asked her to personally verify the computer\'s numbers before his 1962 orbit. Awarded the Presidential Medal of Freedom in 2015.',
    artifact: 'https://www.nasa.gov/content/katherine-johnson-biography' },
    /* ↑ EXAMPLE of a completed entry. Replace bio + artifact with your own
       work (or set status back to 'ghosted') — it shows how a lit cell behaves. */
  { n: 5,  symbol: 'CP',   name: 'Carolyn Parker',           years: '1917–1966', field: 'biology',        status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 6,  symbol: 'RAY',  name: 'Roger Arliner Young',      years: '1899–1964', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 7,  symbol: 'MLR',  name: 'Mary Logan Reddick',       years: '1914–1966', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 8,  symbol: 'JPC',  name: 'Jewel Plummer Cobb',       years: '1924–2017', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 9,  symbol: 'EN',   name: 'Evelyn Nicol',             years: '',          field: 'biology',        status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 10, symbol: 'PSC',  name: 'Patricia S. Cowings',      years: 'b. 1948',   field: 'socialScience',  status: 'ghosted', bio: '', artifact: '' },
  { n: 11, symbol: 'AJE',  name: 'Aprille J. Ericsson',      years: 'b. 1963',   field: 'engineering',    status: 'ghosted', bio: '', artifact: '' },
  { n: 12, symbol: 'GW',   name: 'Gladys West',              years: 'b. 1930',   field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 13, symbol: 'BSL',  name: 'Beebe Steven Lynk',        years: '1872–1948', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 14, symbol: 'SAJ',  name: 'Shirley Ann Jackson',      years: 'b. 1946',   field: 'physics',        status: 'ghosted', bio: '', artifact: '' },
  { n: 15, symbol: 'JMO',  name: 'Joan Murrell Owens',       years: '1933–2011', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 16, symbol: 'KC',   name: 'Kizzmekia Corbett',        years: 'b. 1986',   field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 17, symbol: 'MCT',  name: 'Marie Clark Taylor',       years: '1911–1990', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 18, symbol: 'RWH',  name: 'Ruth W. Howard',           years: '1900–1997', field: 'socialScience',  status: 'ghosted', bio: '', artifact: '' },
  { n: 19, symbol: 'MJ',   name: 'Mary Jackson',             years: '1921–2005', field: 'engineering',    status: 'ghosted', bio: '', artifact: '' },
  { n: 20, symbol: 'DV',   name: 'Dorothy Vaughan',          years: '1910–2008', field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 21, symbol: 'AP',   name: 'Alice Parker',             years: '1895–1920', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 22, symbol: 'SEG',  name: 'Sarah E. Goode',           years: '1855–1905', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 23, symbol: 'CJW',  name: 'Madam C.J. Walker',        years: '1867–1919', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 24, symbol: 'MBDK', name: 'Mary B.D. Kenner',         years: '1912–2006', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 25, symbol: 'HL',   name: 'Henrietta Lacks',          years: '1920–1951', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 26, symbol: 'MC',   name: 'Marian Croak',             years: 'b. 1955',   field: 'engineering',    status: 'ghosted', bio: '', artifact: '' },
  { n: 27, symbol: 'LDN',  name: 'Lyda D. Newman',           years: '1885–1920', field: 'innovation',     status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 28, symbol: 'BC',   name: 'Bessie Coleman',           years: '1892–1926', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 29, symbol: 'AB',   name: 'Alice Ball',               years: '1892–1916', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '' },
  { n: 30, symbol: 'VT',   name: 'Valerie Thomas',           years: 'b. 1943',   field: 'physics',        status: 'ghosted', bio: '', artifact: '' },
  { n: 31, symbol: 'WHM',  name: 'Willie Hobbs Moore',       years: '1934–1994', field: 'physics',        status: 'ghosted', bio: '', artifact: '' },
  { n: 32, symbol: 'MSC',  name: 'Margaret S. Collins',      years: '1922–1996', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 33, symbol: 'LBL',  name: 'Lillian Burwell Lewis',    years: '1904–1987', field: 'biology',        status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 34, symbol: 'IBP',  name: 'Inez Beverly Prosser',     years: '1895–1934', field: 'socialScience',  status: 'ghosted', bio: '', artifact: '' },
  { n: 35, symbol: 'YYC',  name: 'Yvonne Y. Clark',          years: '1929–2019', field: 'engineering',    status: 'ghosted', bio: '', artifact: '' },
  { n: 36, symbol: 'CD',   name: 'Christine Darden',         years: 'b. 1942',   field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 37, symbol: 'BBG',  name: 'Bessie Blount Griffin',    years: '1914–2009', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 38, symbol: 'MVBB', name: 'Marie Van Brittan Brown',  years: '1922–1999', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 39, symbol: 'SB',   name: 'Sarah Boone',              years: '1832–1904', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 40, symbol: 'MB',   name: 'Miriam Benjamin',          years: '1861–1947', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 41, symbol: 'JWR',  name: 'Judy W. Reed',             years: '1826–1905', field: 'innovation',     status: 'ghosted', bio: '', artifact: '' },
  { n: 42, symbol: 'PB',   name: 'Patricia Bath',            years: '1942–2019', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 43, symbol: 'MT',   name: 'Madeline Turner',          years: '',          field: 'innovation',     status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 44, symbol: 'MJ',   name: 'Martha Jones',             years: '',          field: 'innovation',     status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 45, symbol: 'MEH',  name: 'Mary Elliott Hill',        years: '1907–1969', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '' },
  { n: 46, symbol: 'MMD',  name: 'Marie M. Daly',            years: '1921–2003', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '' },
  { n: 47, symbol: 'HNG',  name: 'Hadiyah-Nicole Green',     years: 'b. 1981',   field: 'physics',        status: 'ghosted', bio: '', artifact: '' },
  { n: 48, symbol: 'DJ',   name: 'Deborah Jackson',          years: '',          field: 'physics',        status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 49, symbol: 'RSL',  name: 'Ruth Smith Lloyd',         years: '1917–1995', field: 'biology',        status: 'ghosted', bio: '', artifact: '' },
  { n: 50, symbol: 'AJJ',  name: 'Anna Johnson Julian',      years: '1903–1994', field: 'socialScience',  status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 51, symbol: 'RM',   name: 'Raye Montague',            years: '1935–2018', field: 'engineering',    status: 'ghosted', bio: '', artifact: '' },
  { n: 52, symbol: 'ELH',  name: 'Euphemia Lofton Haynes',   years: '1890–1980', field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 53, symbol: 'SBJ',  name: 'Sophia B. Jones',          years: '1857–1932', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 54, symbol: 'SKT',  name: 'Susie King Taylor',        years: '1848–1912', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 55, symbol: 'MEM',  name: 'Mary Eliza Mahoney',       years: '1845–1926', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 56, symbol: 'DLB',  name: 'Dorothy Lavinia Brown',    years: '1914–2004', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 57, symbol: 'JCW',  name: 'Jane C. Wright',           years: '1919–2013', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 58, symbol: 'RC',   name: 'Rebecca Cole',             years: '1846–1922', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 59, symbol: 'MEC',  name: 'May E. Chinn',             years: '1896–1980', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 60, symbol: 'JH',   name: 'Jane Hinton',              years: '1919–2003', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 61, symbol: 'BWG',  name: 'Bettye Washington Greene', years: '1935–1995', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 62, symbol: 'ALH',  name: 'Alma Levant Hayden',       years: '1927–1967', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '' },
  { n: 63, symbol: 'GLA',  name: 'Gloria Long Anderson',     years: 'b. 1938',   field: 'chemistry',      status: 'ghosted', bio: '', artifact: '' },
  { n: 64, symbol: 'CP',   name: 'Clarice Phelps',           years: 'b. 1981',   field: 'chemistry',      status: 'ghosted', bio: '', artifact: '' },
  { n: 65, symbol: 'SEK',  name: 'Sarah Estelle Kelley',     years: '1916–1950', field: 'chemistry',      status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 66, symbol: 'ZNH',  name: 'Zora Neale Hurston',       years: '1891–1960', field: 'socialScience',  status: 'ghosted', bio: '', artifact: '' },
  { n: 67, symbol: 'SW',   name: 'Stephanie Wilson',         years: 'b. 1966',   field: 'engineering',    status: 'ghosted', bio: '', artifact: '' },
  { n: 68, symbol: 'MLB',  name: 'Marjorie Lee Browne',      years: '1914–1979', field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 69, symbol: 'AC',   name: 'Alexa Canady',             years: 'b. 1950',   field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 70, symbol: 'BM',   name: 'Biddy Mason',              years: '1818–1891', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 71, symbol: 'SMS',  name: 'Susan McKinney Steward',   years: '1847–1918', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 72, symbol: 'JE',   name: 'Joycelyn Elders',          years: 'b. 1933',   field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 73, symbol: 'MML',  name: 'Margaret M. Lawrence',     years: '1914–2019', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 74, symbol: 'RLC',  name: 'Rebecca Lee Crumpler',     years: '1831–1895', field: 'medicine',       status: 'ghosted', bio: '', artifact: '' },
  { n: 75, symbol: 'MRM',  name: 'Melba Roy Mouton',         years: '1929–1990', field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 76, symbol: 'LS',   name: 'Lanre Sulola',             years: '',          field: 'mathematics',    status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 77, symbol: 'AE',   name: 'Annie Easley',             years: '1933–2011', field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 78, symbol: 'EB',   name: 'Evelyn Boyd Granville',    years: '1924–2023', field: 'mathematics',    status: 'ghosted', bio: '', artifact: '' },
  { n: 79, symbol: 'AJ',   name: 'Ashanti Johnson',          years: 'b. 1972',   field: 'earthScience',   status: 'ghosted', bio: '', artifact: '' },
  { n: 80, symbol: 'BATW', name: 'Beth A. Brown',            years: '',          field: 'earthScience',   status: 'ghosted', bio: '', artifact: '', verify: true },
  { n: 81, symbol: 'MW',   name: 'Marguerite Williams',      years: '1895–1991', field: 'earthScience',   status: 'ghosted', bio: '', artifact: '' },
  { n: 82, symbol: 'BAB',  name: 'Beth A. Brown',            years: '1969–2008', field: 'physics',        status: 'ghosted', bio: '', artifact: '', verify: true }
];
