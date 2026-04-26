import { useState } from 'react'
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { verifyDocumentWithAI, type KycResult } from '../lib/kyc'

export function KycModulePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [docType, setDocType] = useState<'AADHAAR' | 'PAN' | 'NGO_REG' | '80G'>('AADHAAR')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<KycResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selected)
      setResult(null)
      setError(null)
    }
  }

  const startVerification = async () => {
    if (!preview) return
    setLoading(true)
    setError(null)
    try {
      const res = await verifyDocumentWithAI(preview, docType)
      setResult(res)

      // Submit to backend for persistence
      const token = localStorage.getItem('token')
      if (token && res.is_verified) {
        await fetch('/api/kyc/submit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ kycResult: res })
        })
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">KYC Verification</h1>
          <p className="text-slate-600">AI-powered identity and document verification</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Upload Document</CardTitle>
              <CardDescription>Select document type and upload a clear image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {(['AADHAAR', 'PAN', 'NGO_REG', '80G'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDocType(t)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      docType === t 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition-all group-hover:border-indigo-400 group-hover:bg-indigo-50/30">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full rounded-2xl object-contain p-2" />
                  ) : (
                    <>
                      <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                        <Upload className="size-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400">JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <Button 
                className="w-full h-12 text-base shadow-lg" 
                disabled={!file || loading}
                onClick={startVerification}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    Verify with VolunAI <ShieldCheck className="ml-2 size-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!result && !loading && (
            <Card className="flex h-full flex-col items-center justify-center border-slate-200 bg-white/50 py-12 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                <FileText className="size-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Ready to Scan</h3>
              <p className="max-w-[240px] px-4 text-sm text-slate-500">
                Upload your document and our AI will verify authenticity and extract data.
              </p>
            </Card>
          )}

          {loading && (
            <Card className="flex h-full flex-col items-center justify-center space-y-6 py-12 text-center">
              <div className="relative">
                <div className="size-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <ShieldCheck className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Analyzing Document</h3>
                <p className="text-sm text-slate-500">Checking for tampering and extracting data...</p>
              </div>
            </Card>
          )}

          {result && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <Card className={`border-2 ${result.is_verified ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge tone={result.is_verified ? 'success' : 'danger'} className="px-3 py-1 text-sm uppercase tracking-wider">
                      {result.is_verified ? 'Verified' : 'Rejected'}
                    </Badge>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      AI Confidence: {result.confidence_score}%
                    </div>
                  </div>
                  <CardTitle className="mt-4 flex items-center gap-2">
                    {result.is_verified ? (
                      <CheckCircle2 className="size-6 text-green-600" />
                    ) : (
                      <AlertCircle className="size-6 text-red-600" />
                    )}
                    Verification Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.rejection_reason && (
                    <div className="mb-4 rounded-xl bg-red-100/50 p-3 text-sm font-medium text-red-700">
                      Reason: {result.rejection_reason}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Extracted Information</div>
                    <div className="grid gap-2">
                      {Object.entries(result.extracted_data).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between rounded-xl bg-white/80 p-3 shadow-sm">
                          <span className="text-sm font-medium text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-bold text-slate-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="mt-6 w-full" 
                    onClick={() => {
                      setResult(null)
                      setPreview(null)
                      setFile(null)
                    }}
                  >
                    <RefreshCw className="mr-2 size-4" /> Reset and try another
                  </Button>
                </CardContent>
              </Card>

              <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-100 flex gap-3">
                <Info className="size-5 text-indigo-600 shrink-0" />
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Verification data is stored securely and encrypted. Your privacy is our priority. Verified users gain access to premium features like direct donation campaigns and emergency coordination.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
