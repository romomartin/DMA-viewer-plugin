export const COLORS = [
    "#FF6900",
    "#FCB900",
    "#7BDCB5",
    "#8ED1FC",
    "#EB144C",
    "#F78DA7",
    "#9900EF",
  ];
  
  export const getColor = (index: number): string => {
    if (index >= COLORS.length) return COLORS[index % COLORS.length];
    return COLORS[index];
  };