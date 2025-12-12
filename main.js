// GENEROVÁNÍ ZAMĚSTNANCŮ

function generateEmployeeData(dtoIn) {
  const maleNames = [
    "Jan","Petr","Pavel","Jiří","Karel","Lukáš","Tomáš","Martin","Ondřej","Jaroslav",
    "Miroslav","Josef","František","Václav","Daniel","Roman","Radek","Jakub","Adam","Štěpán",
    "Libor","Zdeněk","Aleš","Milan","David","Filip","Vojtěch","Marek","Patrik","Dominik",
    "Bohuslav","Leon","Hynek","Robert","Michal","Richard","Ladislav","Alois","Otakar","Artur",
    "Erik","Alexandr","Břetislav","Rostislav","Vratislav","Oldřich","Čeněk","Vilém","Bruno","Albert"
  ];

  const femaleNames = [
    "Eva","Anna","Marie","Tereza","Lucie","Petra","Jana","Martina","Veronika","Kateřina",
    "Hana","Lenka","Barbora","Monika","Klára","Kristýna","Alena","Adéla","Nikola","Gabriela",
    "Karolína","Zuzana","Markéta","Šárka","Ilona","Vlasta","Božena","Tatiana","Ela","Linda",
    "Dominika","Sabina","Renata","Sára","Lea","Eliška","Viktorie","Magda","Nela","Laura",
    "Andrea","Diana","Iveta","Jitka","Jiřina","Zdeňka","Michaela","Silvie","Soňa","Stela"
  ];

  const surnames = [
    "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
    "Marek","Pokorný","Hájek","Král","Růžička","Beneš","Fiala","Sedláček","Doležal","Zeman",
    "Kolář","Vávra","Kříž","Bláha","Kopecký","Malý","Urban","Jelínek","Sýkora",
    "Polák","Ptáček","Bartoš","Vlček","Mach","Kadlec","Šimek","Hrabě","Pospíšil","Štěpánek",
    "Klein","Ševčík","Neuman","Pavlík","Holub","Křížek","Říha","Navrátil","Mark"
  ];

  const workloads = [10, 20, 30, 40];

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateBirthdate(minAge, maxAge) {
    const now = new Date();
    const minDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
    const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const timestamp = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
    return new Date(timestamp).toISOString();
  }

  function femaleSurname(surname) {
    if (surname.endsWith("ek")) return surname.slice(0, -2) + "ková";
    if (surname.endsWith("ec")) return surname.slice(0, -2) + "cová";
    if (surname.endsWith("e")) return surname.slice(0, -1) + "ová";
    if (surname.endsWith("ý")) return surname.slice(0, -1) + "á";
    if (surname.endsWith("a")) return surname + "ová";
    return surname + "ová";
  }

  const employees = [];

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";
    const name = gender === "male" ? randomItem(maleNames) : randomItem(femaleNames);
    let surname = randomItem(surnames);
    if (gender === "female") surname = femaleSurname(surname);

    employees.push({
      gender,
      birthdate: generateBirthdate(dtoIn.age.min, dtoIn.age.max),
      name,
      surname,
      workload: randomItem(workloads)
    });
  }

  return employees;
}

// VÝPOČET STATISTIK

function getAgeFromBirthdate(birthdate) {
  const d = new Date(birthdate);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())
  ) {
    age--;
  }
  return age;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function getEmployeeStatistics(list) {
  const ages = list.map(e => getAgeFromBirthdate(e.birthdate));
  const workloads = list.map(e => e.workload);
  const femaleWorkloads = list.filter(e => e.gender === "female").map(e => e.workload);

  return {
    count: list.length,
    workloadCounts: {
      "10": list.filter(e => e.workload === 10).length,
      "20": list.filter(e => e.workload === 20).length,
      "30": list.filter(e => e.workload === 30).length,
      "40": list.filter(e => e.workload === 40).length
    },
    avgAge: Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10,
    minAge: Math.min(...ages),
    maxAge: Math.max(...ages),
    medianAge: median(ages),
    medianWorkload: median(workloads),
    avgFemaleWorkload:
      femaleWorkloads.length
        ? femaleWorkloads.reduce((a, b) => a + b, 0) / femaleWorkloads.length
        : 0,
    sortedByWorkload: [...list].sort((a, b) => a.workload - b.workload)
  };
}

// HLAVNÍ FUNKCE

function main(dtoIn) {
  const employeeList = generateEmployeeData(dtoIn);
  const statistics = getEmployeeStatistics(employeeList);

  return {
    employeeList,
    statistics
  };
}

// TESTOVACÍ VÝSTUP

console.log(JSON.stringify(main({ count: 5, age: { min: 19, max: 35 } }), null, 2));
