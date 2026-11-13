"""Keep the symbol from the Vecteezy EPS and drop the placeholder wordmark."""

import sys
from pathlib import Path


def is_num(token: str) -> bool:
    try:
        float(token)
    except ValueError:
        return False
    return True


def fmt(n: float) -> str:
    return f"{n:.2f}".rstrip("0").rstrip(".")


def hex_color(rgb: tuple[float, float, float]) -> str:
    return "#" + "".join(f"{round(c * 255):02x}" for c in rgb)


def main() -> None:
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    lines = src.read_text(encoding="latin1").split("%%EOF", 1)[0].splitlines()
    color = (0.0, 0.0, 0.0)
    sub: list[str] = []
    subs: list[str] = []
    pts: list[tuple[float, float]] = []
    kept: list[tuple[str, str, list[tuple[float, float]]]] = []

    def close_sub() -> None:
        nonlocal sub, pts
        if sub:
            subs.append(" ".join(sub))
        sub = []

    for raw in lines:
        parts = raw.split()
        if not parts:
            continue
        op = parts[-1]
        if op == "rgb" and len(parts) >= 4:
            color = tuple(float(n) for n in parts[:3])
        elif op == "mo" and len(parts) >= 3 and is_num(parts[0]):
            close_sub()
            x, y = float(parts[0]), float(parts[1])
            sub = [f"M {fmt(x)} {fmt(y)}"]
            pts.append((x, y))
        elif op == "li" and len(parts) >= 3 and sub and is_num(parts[0]):
            x, y = float(parts[0]), float(parts[1])
            sub.append(f"L {fmt(x)} {fmt(y)}")
            pts.append((x, y))
        elif op == "cv" and len(parts) >= 7 and sub and is_num(parts[0]):
            nums = [float(n) for n in parts[:6]]
            sub.append("C " + " ".join(fmt(n) for n in nums))
            pts.extend((nums[i], nums[i + 1]) for i in (0, 2, 4))
        elif op == "cp" and sub:
            sub.append("Z")
        elif op == "f":
            close_sub()
            if pts and subs:
                xs = [p[0] for p in pts]
                ys = [p[1] for p in pts]
                wide = max(xs) - min(xs) > 1500 or max(ys) - min(ys) > 1500
                paper = all(c > 0.95 for c in color)
                # Placeholder wordmark sits above the symbol in user space.
                lettering = min(ys) > 1400
                if not wide and not paper and not lettering:
                    kept.append((hex_color(color), " ".join(subs), pts))
            subs = []
            pts = []

    all_pts = [p for _, _, pts in kept for p in pts]
    min_x = min(p[0] for p in all_pts)
    min_y = min(p[1] for p in all_pts)
    max_x = max(p[0] for p in all_pts)
    max_y = max(p[1] for p in all_pts)
    pad = 8
    box = f"{fmt(min_x - pad)} {fmt(min_y - pad)} {fmt(max_x - min_x + pad * 2)} {fmt(max_y - min_y + pad * 2)}"
    paths = "\n".join(f'  <path fill="{color}" d="{d}"/>' for color, d, _ in kept)
    dest.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img" aria-hidden="true">\n{paths}\n</svg>\n',
        encoding="utf-8",
    )
    print(f"{len(kept)} paths, viewBox {box}")


if __name__ == "__main__":
    main()
