export type LeafKind = "melissa" | "salvia" | "mentha";

export type Plant = {
  id: LeafKind;
  latin: string;
  polish: string;
  use: string;
  caution: string;
};

export const EMA_HERBAL_URL = "https://www.ema.europa.eu/en/human-regulatory-overview/herbal-medicinal-products";

export const plants: Plant[] = [
  {
    id: "melissa",
    latin: "Melissa officinalis",
    polish: "melisa lekarska",
    use: "Tradycyjnie stosowana przy łagodnych objawach stresu i jako wsparcie zasypiania.",
    caution: "Według EMA nie zaleca się stosowania u dzieci poniżej 12 lat.",
  },
  {
    id: "salvia",
    latin: "Salvia officinalis",
    polish: "szałwia lekarska",
    use: "Tradycyjnie stosowana do płukania przy podrażnieniach jamy ustnej i gardła.",
    caution: "Zawiera tujon — nie stosuj w ciąży, podczas karmienia piersią ani długotrwale.",
  },
  {
    id: "mentha",
    latin: "Mentha × piperita",
    polish: "mięta pieprzowa",
    use: "Tradycyjnie stosowana przy łagodnych dolegliwościach trawiennych, np. wzdęciach.",
    caution: "Może nasilać objawy refluksu.",
  },
];
