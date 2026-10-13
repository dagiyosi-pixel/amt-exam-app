Add-Type -AssemblyName System.Drawing

function Create-AppIcon {
    param(
        [int]$Size,
        [string]$Path
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Dark deep slate/green background
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(10, 25, 18))
    $g.FillRectangle($bgBrush, 0, 0, $Size, $Size)

    # Ethiopian Green circle background
    $circleMargin = [int]($Size * 0.07)
    $circleSize = $Size - (2 * $circleMargin)
    $greenBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
        (New-Object System.Drawing.Point 0, 0),
        (New-Object System.Drawing.Point $Size, $Size),
        ([System.Drawing.Color]::FromArgb(0, 132, 61)),
        ([System.Drawing.Color]::FromArgb(6, 60, 30))
    )
    $g.FillEllipse($greenBrush, $circleMargin, $circleMargin, $circleSize, $circleSize)

    # Ethiopian Golden ring
    $goldPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(252, 209, 22)), ([Math]::Max(3, [int]($Size * 0.025)))
    $g.DrawEllipse($goldPen, $circleMargin, $circleMargin, $circleSize, $circleSize)

    # Tri-color ribbons in center (Green, Gold, Red)
    $cy = $Size * 0.42
    $s = $Size * 0.36

    # Red lower stripe
    $redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(211, 18, 42))
    $redPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(211, 18, 42)), ([Math]::Max(4, [int]($Size * 0.04)))
    $g.DrawArc($redPen, [float]($Size * 0.2), [float]($Size * 0.38), [float]($Size * 0.6), [float]($Size * 0.28), 160, 120)

    # Gold middle stripe
    $goldStripePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(252, 209, 22)), ([Math]::Max(4, [int]($Size * 0.04)))
    $g.DrawArc($goldStripePen, [float]($Size * 0.22), [float]($Size * 0.32), [float]($Size * 0.56), [float]($Size * 0.28), 165, 120)

    # White Jet plane silhouette
    $cx = $Size / 2
    $p1 = New-Object System.Drawing.PointF $cx, ($cy - $s * 0.72)
    $p2 = New-Object System.Drawing.PointF ($cx + $s * 0.14), ($cy - $s * 0.2)
    $p3 = New-Object System.Drawing.PointF ($cx + $s * 0.78), ($cy + $s * 0.12)
    $p4 = New-Object System.Drawing.PointF ($cx + $s * 0.78), ($cy + $s * 0.26)
    $p5 = New-Object System.Drawing.PointF ($cx + $s * 0.18), ($cy + $s * 0.22)
    $p6 = New-Object System.Drawing.PointF ($cx + $s * 0.18), ($cy + $s * 0.55)
    $p7 = New-Object System.Drawing.PointF ($cx + $s * 0.42), ($cy + $s * 0.7)
    $p8 = New-Object System.Drawing.PointF ($cx + $s * 0.42), ($cy + $s * 0.8)
    $p9 = New-Object System.Drawing.PointF $cx, ($cy + $s * 0.72)

    $p10 = New-Object System.Drawing.PointF ($cx - $s * 0.42), ($cy + $s * 0.8)
    $p11 = New-Object System.Drawing.PointF ($cx - $s * 0.42), ($cy + $s * 0.7)
    $p12 = New-Object System.Drawing.PointF ($cx - $s * 0.18), ($cy + $s * 0.55)
    $p13 = New-Object System.Drawing.PointF ($cx - $s * 0.18), ($cy + $s * 0.22)
    $p14 = New-Object System.Drawing.PointF ($cx - $s * 0.78), ($cy + $s * 0.26)
    $p15 = New-Object System.Drawing.PointF ($cx - $s * 0.78), ($cy + $s * 0.12)
    $p16 = New-Object System.Drawing.PointF ($cx - $s * 0.14), ($cy - $s * 0.2)

    [System.Drawing.PointF[]]$points = @($p1, $p2, $p3, $p4, $p5, $p6, $p7, $p8, $p9, $p10, $p11, $p12, $p13, $p14, $p15, $p16)
    $planeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.FillPolygon($planeBrush, $points)

    # "ETHIOPIAN AMT" Text at bottom
    [float]$fontSize = [float]($Size * 0.08)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(252, 209, 22))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = New-Object System.Drawing.RectangleF 0, ($Size * 0.73), $Size, ($Size * 0.18)
    $g.DrawString("AMT MASTER", $font, $textBrush, $textRect, $format)

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created Ethiopian Airlines themed icon: $Path ($Size x $Size)"
}

Create-AppIcon -Size 192 -Path "public/icons/icon-192.png"
Create-AppIcon -Size 512 -Path "public/icons/icon-512.png"
