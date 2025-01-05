"use client"

import { useServerData } from "@/app/lib/server-data-context"
import { BackIcon } from "@/components/Icon"
import ServerFlag from "@/components/ServerFlag"
import { ServerDetailLoading } from "@/components/loading/ServerDetailLoading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatBytes } from "@/lib/utils"
import countries from "i18n-iso-countries"
import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ServerDetailClient({ server_id }: { server_id: number }) {
  const router = useRouter()

  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    const previousPath = sessionStorage.getItem("fromMainPage")
    if (previousPath) {
      setHasHistory(true)
    }
  }, [])

  const linkClick = () => {
    if (hasHistory) {
      router.back()
    } else {
      router.push(`/`)
    }
  }

  const { data: serverList, isSSEConnected } = useServerData()
  const data = serverList?.result?.find((item) => item.id === server_id)

  if (!data && !isSSEConnected) {
    notFound()
  }

  if (!data) return <ServerDetailLoading />

  countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

  return (
    <div>
      <div
        onClick={linkClick}
        className="flex flex-none cursor-pointer font-semibold leading-none items-center break-all tracking-tight gap-0.5 text-xl"
      >
        <BackIcon />
        {data?.name}
      </div>
      <section className="flex flex-wrap gap-2 mt-3">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"状态"}</p>
              <Badge
                className={cn(
                  "text-[9px] rounded-[6px] w-fit px-1 py-0 -mt-[0.3px] dark:text-white",
                  {
                    " bg-green-800": data?.online_status,
                    " bg-red-600": !data?.online_status,
                  },
                )}
              >
                {data?.online_status ? "在线" : "离线"}
              </Badge>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"在线时长"}</p>
              <div className="text-xs">
                {" "}
                {data?.status.Uptime / 86400 >= 1
                  ? (data?.status.Uptime / 86400).toFixed(0) + " " + "天"
                  : (data?.status.Uptime / 3600).toFixed(0) + " " + "小时"}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        {data?.host.Version && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"版本"}</p>
                <div className="text-xs">{data?.host.Version} </div>
              </section>
            </CardContent>
          </Card>
        )}
        {data?.host.Arch && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"架构"}</p>
                <div className="text-xs">{data?.host.Arch} </div>
              </section>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"内存"}</p>
              <div className="text-xs">{formatBytes(data?.host.MemTotal)}</div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"硬盘"}</p>
              <div className="text-xs">{formatBytes(data?.host.DiskTotal)}</div>
            </section>
          </CardContent>
        </Card>
        {data?.host.CountryCode && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"地区"}</p>
                <section className="flex items-start gap-1">
                  <div className="text-xs text-start">
                    {countries.getName(data?.host.CountryCode, "en")}
                  </div>
                  <ServerFlag
                    className="text-[11px] -mt-[1px]"
                    country_code={data?.host.CountryCode}
                  />
                </section>
              </section>
            </CardContent>
          </Card>
        )}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        {data?.host.Platform && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"系统"}</p>

                <div className="text-xs">
                  {" "}
                  {data?.host.Platform} - {data?.host.PlatformVersion}{" "}
                </div>
              </section>
            </CardContent>
          </Card>
        )}
        {data?.host.CPU && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"CPU"}</p>

                <div className="text-xs"> {data?.host.CPU.join(", ")}</div>
              </section>
            </CardContent>
          </Card>
        )}
        {data?.host.GPU && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"GPU"}</p>
                <div className="text-xs"> {data?.host.GPU.join(", ")}</div>
              </section>
            </CardContent>
          </Card>
        )}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"负载"}</p>
              <div className="text-xs">
                {data.status.Load1.toFixed(2) || "0.00"} / {data.status.Load5.toFixed(2) || "0.00"}{" "}
                / {data.status.Load15.toFixed(2) || "0.00"}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"上传"}</p>
              {data.status.NetOutTransfer ? (
                <div className="text-xs"> {formatBytes(data.status.NetOutTransfer)} </div>
              ) : (
                <div className="text-xs">Unknown</div>
              )}
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"下载"}</p>
              {data.status.NetInTransfer ? (
                <div className="text-xs"> {formatBytes(data.status.NetInTransfer)} </div>
              ) : (
                <div className="text-xs">Unknown</div>
              )}
            </section>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
