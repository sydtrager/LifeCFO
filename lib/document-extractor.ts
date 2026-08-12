export type ExtractionPreview={synthetic:boolean;provider:string;message:string;transactions:Array<{date:string;description:string;amount:number}>};
export interface DocumentExtractor{extract(path:string,mimeType:string):Promise<ExtractionPreview>}
export class MockDocumentExtractor implements DocumentExtractor{
  async extract(){return {synthetic:true,provider:"development-mock",message:"Synthetic preview only. This data was not extracted from your document.",transactions:[{date:"2026-07-01",description:"Synthetic grocery example",amount:-84.32}]}}
}
