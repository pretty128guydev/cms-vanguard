import {
  CreateDocument,
  UpdateDocument,
} from "@/cms/DatabaseHelpers/database-helper";

export async function POST(request){
    const body = await request.json()
    console.log('payloads',body)
    if(body.payloads instanceof Array){
        body.payloads.forEach( async payload => {
            if(payload.create){
              const res = await CreateDocument(
                  process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
                  process.env.NEXT_PUBLIC_VNG_INSPECTION,
                  payload.create.newData,
                  payload.create.customId // Pass the custom ID here
              );
              if(res.success){
                    const res2 = await UpdateDocument(
                        process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
                        process.env.NEXT_PUBLIC_VNG_CLAIMS,
                        payload.update.id,
                        { status: "Inspection Completed" }
                    );
                    if (res2.success) return Response.json({success:true})
              }
            } else if (payload.update){
              const res2 = await UpdateDocument(
                process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
                process.env.NEXT_PUBLIC_VNG_CLAIMS,
                payload.update.id,
                { status: "Inspection Completed" }
              );  
              if (res2.success) return Response.json({success:true})
            }
        })
    }
    return Response.json({success:false})
}