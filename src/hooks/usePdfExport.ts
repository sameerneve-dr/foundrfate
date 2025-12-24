import { jsPDF } from "jspdf";
import type { IdeaData } from "@/pages/Index";
import type { AnalysisResult } from "@/hooks/useIdeaAnalysis";

export const usePdfExport = () => {
  const exportToPdf = (ideaData: IdeaData, analysis: AnalysisResult) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addTitle = (text: string, size: number = 18) => {
      checkPageBreak(size + 10);
      doc.setFontSize(size);
      doc.setFont("helvetica", "bold");
      doc.text(text, margin, y);
      y += size * 0.5 + 5;
    };

    const addSubtitle = (text: string) => {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(text, margin, y);
      y += 7;
    };

    const addText = (text: string, indent: number = 0) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(text, maxWidth - indent);
      lines.forEach((line: string) => {
        checkPageBreak(7);
        doc.text(line, margin + indent, y);
        y += 5;
      });
      y += 3;
    };

    const addBullet = (text: string) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(`• ${text}`, maxWidth - 10);
      lines.forEach((line: string, i: number) => {
        checkPageBreak(7);
        doc.text(i === 0 ? line : `  ${line}`, margin + 5, y);
        y += 5;
      });
    };

    const checkPageBreak = (neededSpace: number) => {
      if (y + neededSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const addSpacer = (space: number = 8) => {
      y += space;
    };

    // Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("FoundrFate Analysis Report", margin, 28);
    doc.setTextColor(0, 0, 0);
    y = 55;

    // Idea Overview
    addTitle(ideaData.ideaName, 20);
    addSpacer(5);

    // Decision Badge
    const decisionText = analysis.decision === "yes" 
      ? "YES — PURSUE" 
      : analysis.decision === "conditional" 
      ? "CONDITIONAL — PURSUE WITH CHANGES" 
      : "NO — DO NOT PURSUE";
    
    doc.setFillColor(analysis.decision === "yes" ? 34 : analysis.decision === "conditional" ? 150 : 200, 
                     analysis.decision === "yes" ? 139 : analysis.decision === "conditional" ? 150 : 50, 
                     analysis.decision === "yes" ? 34 : analysis.decision === "conditional" ? 150 : 50);
    doc.roundedRect(margin, y, 80, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(decisionText, margin + 5, y + 7);
    doc.setTextColor(0, 0, 0);
    y += 20;

    addText(analysis.decisionRationale.summary);
    addSpacer(10);

    // Decision Rationale
    addTitle("Decision Rationale", 14);
    addSubtitle("Key Metrics");
    addText(`Market Saturation: ${analysis.decisionRationale.marketSaturation.toUpperCase()}`);
    addText(`Differentiation: ${analysis.decisionRationale.differentiation.toUpperCase()}`);
    addText(`User Urgency: ${analysis.decisionRationale.userUrgency.toUpperCase()}`);
    addText(`Founder-Market Fit: ${analysis.decisionRationale.founderMarketFit.toUpperCase()}`);
    addSpacer(5);
    
    addSubtitle("Real Need Assessment");
    addText(`Type: ${analysis.realNeedAnalysis.isPainkiller ? "Painkiller" : "Vitamin"}`);
    addText(`Willingness: ${analysis.realNeedAnalysis.willingness}`);
    addText(analysis.realNeedAnalysis.explanation);
    addSpacer(10);

    // Competitive Landscape
    addTitle("Competitive Landscape", 14);
    addText(`Market Status: ${analysis.competitiveLandscape.marketCrowded ? "Crowded" : "Has Room"}`);
    addSpacer(3);
    
    if (analysis.competitiveLandscape.directCompetitors.length > 0) {
      addSubtitle("Direct Competitors");
      analysis.competitiveLandscape.directCompetitors.forEach(comp => {
        addText(`${comp.name}: ${comp.coreOffering}`, 0);
        addText(`Strength: ${comp.strength}`, 5);
        addText(`Weakness: ${comp.weakness}`, 5);
        if (comp.marketGap) addText(`Gap: ${comp.marketGap}`, 5);
        addSpacer(3);
      });
    }

    if (analysis.competitiveLandscape.indirectCompetitors.length > 0) {
      addSubtitle("Indirect Competitors");
      analysis.competitiveLandscape.indirectCompetitors.forEach(comp => {
        addText(`${comp.name}: ${comp.coreOffering}`, 0);
        addSpacer(2);
      });
    }

    addSubtitle("Market Analysis");
    addText(`What's Solved: ${analysis.competitiveLandscape.whatIsSolved}`);
    addText(`Opportunity: ${analysis.competitiveLandscape.whatIsNot}`);
    addSpacer(10);

    // Value Analysis
    addTitle("Value Analysis", 14);
    addText(analysis.valueAnalysis.whyExist);
    addSpacer(3);
    addText(`Time Saved: ${analysis.valueAnalysis.timeSaved}`);
    addText(`Money Saved: ${analysis.valueAnalysis.moneySaved}`);
    addText(`Risk Reduced: ${analysis.valueAnalysis.riskReduced}`);
    addText(`Revenue Impact: ${analysis.valueAnalysis.revenueUnlocked}`);
    addSpacer(10);

    // Pitch Story
    addTitle("Pitch Story", 14);
    addText(analysis.pitchStory);
    addSpacer(10);

    // Pitch Deck
    addTitle("Pitch Deck Outline", 14);
    const deckSlides = [
      { num: 1, title: "Problem", content: analysis.pitchDeck.problem },
      { num: 2, title: "Why Now", content: analysis.pitchDeck.whyNow },
      { num: 3, title: "Solution", content: analysis.pitchDeck.solution },
      { num: 4, title: "Market Size", content: analysis.pitchDeck.marketSize },
      { num: 5, title: "Business Model", content: analysis.pitchDeck.businessModel },
      { num: 6, title: "Go-to-Market", content: analysis.pitchDeck.goToMarket },
      { num: 7, title: "Differentiator", content: analysis.pitchDeck.differentiator },
    ];
    deckSlides.forEach(slide => {
      addSubtitle(`${slide.num}. ${slide.title}`);
      addText(slide.content, 5);
    });
    addSpacer(10);

    // Company Formation
    addTitle("Company Formation", 14);
    addText(`Entity Type: ${analysis.companyFormation.entityType}`);
    addText(`Reason: ${analysis.companyFormation.entityReason}`);
    addText(`When to Incorporate: ${analysis.companyFormation.whenToIncorporate}`);
    addText(`Equity Advice: ${analysis.companyFormation.equityAdvice}`);
    addSpacer(5);
    addSubtitle("Profit Structure");
    addText(`Recommendation: ${analysis.profitStructure.recommendation}`);
    addText(`Reason: ${analysis.profitStructure.reason}`);
    addSpacer(10);

    // Timeline
    addTitle("Execution Timeline", 14);
    
    addSubtitle("Month 0-1: Validation");
    analysis.timeline.month0to1.forEach(task => addBullet(task));
    addSpacer(3);
    
    addSubtitle("Month 2-3: MVP");
    analysis.timeline.month2to3.forEach(task => addBullet(task));
    addSpacer(3);
    
    addSubtitle("Month 4-6: Early Users");
    analysis.timeline.month4to6.forEach(task => addBullet(task));
    addSpacer(3);
    
    addSubtitle("Month 7+: Scale");
    analysis.timeline.month7plus.forEach(task => addBullet(task));
    addSpacer(10);

    // Pivot Suggestions
    if (analysis.pivotSuggestions && analysis.pivotSuggestions.length > 0) {
      addTitle("Alternative Approaches", 14);
      analysis.pivotSuggestions.forEach((pivot, i) => {
        addSubtitle(`${i + 1}. ${pivot.title}`);
        addText(pivot.description, 5);
        addText(`Why Better: ${pivot.whyBetter}`, 5);
        addSpacer(3);
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated by FoundrFate on ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 10);

    // Save
    const filename = `${ideaData.ideaName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-analysis.pdf`;
    doc.save(filename);
  };

  return { exportToPdf };
};
