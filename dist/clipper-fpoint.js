var ClipperLib = {};
ClipperLib.version = '6.4.2.2';
ClipperLib.use_lines = true;
ClipperLib.use_xyz = false;
var Inherit = function (ce, ce2) {
    var p;
    if (typeof Object.getOwnPropertyNames === 'undefined') {
        for (p in ce2.prototype) 
            { if (typeof ce.prototype[p] === 'undefined' || ce.prototype[p] === Object.prototype[p]) 
            { ce.prototype[p] = ce2.prototype[p]; } }
        for (p in ce2) 
            { if (typeof ce[p] === 'undefined') 
            { ce[p] = ce2[p]; } }
        ce.$baseCtor = ce2;
    } else {
        var props = Object.getOwnPropertyNames(ce2.prototype);
        for (var i = 0;i < props.length; i++) 
            { if (typeof Object.getOwnPropertyDescriptor(ce.prototype, props[i]) === 'undefined') 
            { Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i])); } }
        for (p in ce2) 
            { if (typeof ce[p] === 'undefined') 
            { ce[p] = ce2[p]; } }
        ce.$baseCtor = ce2;
    }
};
ClipperLib.Path = function () {
    return [];
};
ClipperLib.Path.prototype.push = Array.prototype.push;
ClipperLib.Paths = function () {
    return [];
};
ClipperLib.Paths.prototype.push = Array.prototype.push;
ClipperLib.PolyNode = function () {
    this.m_Parent = null;
    this.m_polygon = new ClipperLib.Path();
    this.m_Index = 0;
    this.m_jointype = 0;
    this.m_endtype = 0;
    this.m_Childs = [];
    this.IsOpen = false;
};
ClipperLib.PolyNode.prototype.IsHoleNode = function () {
    var result = true;
    var node = this.m_Parent;
    while (node !== null) {
        result = !result;
        node = node.m_Parent;
    }
    return result;
};
ClipperLib.PolyNode.prototype.ChildCount = function () {
    return this.m_Childs.length;
};
ClipperLib.PolyNode.prototype.Contour = function () {
    return this.m_polygon;
};
ClipperLib.PolyNode.prototype.AddChild = function (Child) {
    var cnt = this.m_Childs.length;
    this.m_Childs.push(Child);
    Child.m_Parent = this;
    Child.m_Index = cnt;
};
ClipperLib.PolyNode.prototype.GetNext = function () {
    if (this.m_Childs.length > 0) 
        { return this.m_Childs[0]; }
     else 
        { return this.GetNextSiblingUp(); }
};
ClipperLib.PolyNode.prototype.GetNextSiblingUp = function () {
    if (this.m_Parent === null) 
        { return null; }
     else if (this.m_Index === this.m_Parent.m_Childs.length - 1) 
        { return this.m_Parent.GetNextSiblingUp(); }
     else 
        { return this.m_Parent.m_Childs[this.m_Index + 1]; }
};
ClipperLib.PolyNode.prototype.Childs = function () {
    return this.m_Childs;
};
ClipperLib.PolyNode.prototype.Parent = function () {
    return this.m_Parent;
};
ClipperLib.PolyNode.prototype.IsHole = function () {
    return this.IsHoleNode();
};
ClipperLib.PolyTree = function () {
    this.m_AllPolys = [];
    ClipperLib.PolyNode.call(this);
};
ClipperLib.PolyTree.prototype.Clear = function () {
    var this$1 = this;

    for (var i = 0, ilen = this.m_AllPolys.length;i < ilen; i++) 
        { this$1.m_AllPolys[i] = null; }
    this.m_AllPolys.length = 0;
    this.m_Childs.length = 0;
};
ClipperLib.PolyTree.prototype.GetFirst = function () {
    if (this.m_Childs.length > 0) 
        { return this.m_Childs[0]; }
     else 
        { return null; }
};
ClipperLib.PolyTree.prototype.Total = function () {
    var result = this.m_AllPolys.length;
    if (result > 0 && this.m_Childs[0] !== this.m_AllPolys[0]) 
        { result--; }
    return result;
};
Inherit(ClipperLib.PolyTree, ClipperLib.PolyNode);
ClipperLib.Clear = function (a) {
    a.length = 0;
};
ClipperLib.PI = 3.141592653589793;
ClipperLib.PI2 = 2 * 3.141592653589793;
ClipperLib.FPoint = function () {
    var a = arguments, alen = a.length;
    this.X = 0;
    this.Y = 0;
    if (ClipperLib.use_xyz) {
        this.Z = 0;
        if (alen === 3) {
            this.X = a[0];
            this.Y = a[1];
            this.Z = a[2];
        } else if (alen === 2) {
            this.X = a[0];
            this.Y = a[1];
            this.Z = 0;
        } else if (alen === 1) {
            if (a[0] instanceof ClipperLib.FPoint) {
                var dp = a[0];
                this.X = dp.X;
                this.Y = dp.Y;
                this.Z = 0;
            } else {
                var pt = a[0];
                if (typeof pt.Z === "undefined") 
                    { pt.Z = 0; }
                this.X = pt.X;
                this.Y = pt.Y;
                this.Z = pt.Z;
            }
        } else {
            this.X = 0;
            this.Y = 0;
            this.Z = 0;
        }
    } else {
        if (alen === 2) {
            this.X = a[0];
            this.Y = a[1];
        } else if (alen === 1) {
            if (a[0] instanceof ClipperLib.FPoint) {
                var dp = a[0];
                this.X = dp.X;
                this.Y = dp.Y;
            } else {
                var pt = a[0];
                this.X = pt.X;
                this.Y = pt.Y;
            }
        } else {
            this.X = 0;
            this.Y = 0;
        }
    }
};
ClipperLib.FPoint.op_Equality = function (a, b) {
    return a.X === b.X && a.Y === b.Y;
};
ClipperLib.FPoint.op_Inequality = function (a, b) {
    return a.X !== b.X || a.Y !== b.Y;
};
ClipperLib.FPoint0 = function () {
    this.X = 0;
    this.Y = 0;
    if (ClipperLib.use_xyz) 
        { this.Z = 0; }
};
ClipperLib.FPoint0.prototype = ClipperLib.FPoint.prototype;
ClipperLib.FPoint1 = function (pt) {
    this.X = pt.X;
    this.Y = pt.Y;
    if (ClipperLib.use_xyz) {
        if (typeof pt.Z === "undefined") 
            { this.Z = 0; }
         else 
            { this.Z = pt.Z; }
    }
};
ClipperLib.FPoint1.prototype = ClipperLib.FPoint.prototype;
ClipperLib.FPoint1dp = function (dp) {
    this.X = dp.X;
    this.Y = dp.Y;
    if (ClipperLib.use_xyz) 
        { this.Z = 0; }
};
ClipperLib.FPoint1dp.prototype = ClipperLib.FPoint.prototype;
ClipperLib.FPoint2 = function (x, y, z) {
    this.X = x;
    this.Y = y;
    if (ClipperLib.use_xyz) {
        if (typeof z === "undefined") 
            { this.Z = 0; }
         else 
            { this.Z = z; }
    }
};
ClipperLib.FPoint2.prototype = ClipperLib.FPoint.prototype;
ClipperLib.FRect = function () {
    var a = arguments, alen = a.length;
    if (alen === 4) {
        this.left = a[0];
        this.top = a[1];
        this.right = a[2];
        this.bottom = a[3];
    } else if (alen === 1) {
        var ir = a[0];
        this.left = ir.left;
        this.top = ir.top;
        this.right = ir.right;
        this.bottom = ir.bottom;
    } else {
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
    }
};
ClipperLib.FRect0 = function () {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
};
ClipperLib.FRect0.prototype = ClipperLib.FRect.prototype;
ClipperLib.FRect1 = function (ir) {
    this.left = ir.left;
    this.top = ir.top;
    this.right = ir.right;
    this.bottom = ir.bottom;
};
ClipperLib.FRect1.prototype = ClipperLib.FRect.prototype;
ClipperLib.FRect4 = function (l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
};
ClipperLib.FRect4.prototype = ClipperLib.FRect.prototype;
ClipperLib.ClipType = {
    ctIntersection: 0,
    ctUnion: 1,
    ctDifference: 2,
    ctXor: 3
};
ClipperLib.PolyType = {
    ptSubject: 0,
    ptClip: 1
};
ClipperLib.PolyFillType = {
    pftEvenOdd: 0,
    pftNonZero: 1,
    pftPositive: 2,
    pftNegative: 3
};
ClipperLib.JoinType = {
    jtSquare: 0,
    jtRound: 1,
    jtMiter: 2
};
ClipperLib.EndType = {
    etOpenSquare: 0,
    etOpenRound: 1,
    etOpenButt: 2,
    etClosedLine: 3,
    etClosedPolygon: 4
};
ClipperLib.EdgeSide = {
    esLeft: 0,
    esRight: 1
};
ClipperLib.Direction = {
    dRightToLeft: 0,
    dLeftToRight: 1
};
ClipperLib.TEdge = function () {
    this.Bot = new ClipperLib.FPoint0();
    this.Curr = new ClipperLib.FPoint0();
    this.Top = new ClipperLib.FPoint0();
    this.Delta = new ClipperLib.FPoint0();
    this.Dx = 0;
    this.PolyTyp = ClipperLib.PolyType.ptSubject;
    this.Side = ClipperLib.EdgeSide.esLeft;
    this.WindDelta = 0;
    this.WindCnt = 0;
    this.WindCnt2 = 0;
    this.OutIdx = 0;
    this.Next = null;
    this.Prev = null;
    this.NextInLML = null;
    this.NextInAEL = null;
    this.PrevInAEL = null;
    this.NextInSEL = null;
    this.PrevInSEL = null;
};
ClipperLib.IntersectNode = function () {
    this.Edge1 = null;
    this.Edge2 = null;
    this.Pt = new ClipperLib.FPoint0();
};
ClipperLib.MyIntersectNodeSort = function () {};
ClipperLib.MyIntersectNodeSort.Compare = function (node1, node2) {
    var i = node2.Pt.Y - node1.Pt.Y;
    if (i > 0) 
        { return 1; }
     else if (i < 0) 
        { return -1; }
     else 
        { return 0; }
};
ClipperLib.LocalMinima = function () {
    this.Y = 0;
    this.LeftBound = null;
    this.RightBound = null;
    this.Next = null;
};
ClipperLib.Scanbeam = function () {
    this.Y = 0;
    this.Next = null;
};
ClipperLib.Maxima = function () {
    this.X = 0;
    this.Next = null;
    this.Prev = null;
};
ClipperLib.OutRec = function () {
    this.Idx = 0;
    this.IsHole = false;
    this.IsOpen = false;
    this.FirstLeft = null;
    this.Pts = null;
    this.BottomPt = null;
    this.PolyNode = null;
};
ClipperLib.OutPt = function () {
    this.Idx = 0;
    this.Pt = new ClipperLib.FPoint0();
    this.Next = null;
    this.Prev = null;
};
ClipperLib.Join = function () {
    this.OutPt1 = null;
    this.OutPt2 = null;
    this.OffPt = new ClipperLib.FPoint0();
};
ClipperLib.ClipperBase = function () {
    this.m_MinimaList = null;
    this.m_CurrentLM = null;
    this.m_edges = new Array();
    this.m_HasOpenPaths = false;
    this.PreserveCollinear = false;
    this.m_Scanbeam = null;
    this.m_PolyOuts = null;
    this.m_ActiveEdges = null;
};
ClipperLib.ClipperBase.horizontal = -3.4E+38;
ClipperLib.ClipperBase.Skip = -2;
ClipperLib.ClipperBase.Unassigned = -1;
ClipperLib.ClipperBase.tolerance = 1E-20;
ClipperLib.ClipperBase.maxValue = Math.sqrt(Number.MAX_VALUE);
ClipperLib.ClipperBase.minValue = Math.sqrt(Number.MIN_VALUE);
ClipperLib.ClipperBase.near_zero = function (val) {
    return val > -ClipperLib.ClipperBase.tolerance && val < ClipperLib.ClipperBase.tolerance;
};
ClipperLib.ClipperBase.IsHorizontal = function (e) {
    return e.Delta.Y === 0;
};
ClipperLib.ClipperBase.prototype.PointIsVertex = function (pt, pp) {
    var pp2 = pp;
    do {
        if (ClipperLib.FPoint.op_Equality(pp2.Pt, pt)) 
            { return true; }
        pp2 = pp2.Next;
    } while (pp2 !== pp);
    return false;
};
ClipperLib.ClipperBase.prototype.PointOnLineSegment = function (pt, linePt1, linePt2) {
    return pt.X === linePt1.X && pt.Y === linePt1.Y || pt.X === linePt2.X && pt.Y === linePt2.Y || pt.X > linePt1.X === pt.X < linePt2.X && pt.Y > linePt1.Y === pt.Y < linePt2.Y && (pt.X - linePt1.X) * (linePt2.Y - linePt1.Y) === (linePt2.X - linePt1.X) * (pt.Y - linePt1.Y);
};
ClipperLib.ClipperBase.prototype.PointOnPolygon = function (pt, pp) {
    var this$1 = this;

    var pp2 = pp;
    while (true) {
        if (this$1.PointOnLineSegment(pt, pp2.Pt, pp2.Next.Pt)) 
            { return true; }
        pp2 = pp2.Next;
        if (pp2 === pp) 
            { break; }
    }
    return false;
};
ClipperLib.ClipperBase.prototype.SlopesEqual = (ClipperLib.ClipperBase.SlopesEqual = function () {
    var a = arguments, alen = a.length;
    var e1, e2, pt1, pt2, pt3, pt4;
    if (alen === 2) {
        e1 = a[0];
        e2 = a[1];
        return e1.Delta.Y * e2.Delta.X === e1.Delta.X * e2.Delta.Y;
    } else if (alen === 3) {
        pt1 = a[0];
        pt2 = a[1];
        pt3 = a[2];
        return (pt1.Y - pt2.Y) * (pt2.X - pt3.X) - (pt1.X - pt2.X) * (pt2.Y - pt3.Y) === 0;
    } else {
        pt1 = a[0];
        pt2 = a[1];
        pt3 = a[2];
        pt4 = a[3];
        return (pt1.Y - pt2.Y) * (pt3.X - pt4.X) - (pt1.X - pt2.X) * (pt3.Y - pt4.Y) === 0;
    }
});
ClipperLib.ClipperBase.SlopesEqual3 = function (e1, e2) {
    return e1.Delta.Y * e2.Delta.X === e1.Delta.X * e2.Delta.Y;
};
ClipperLib.ClipperBase.SlopesEqual4 = function (pt1, pt2, pt3) {
    return (pt1.Y - pt2.Y) * (pt2.X - pt3.X) - (pt1.X - pt2.X) * (pt2.Y - pt3.Y) === 0;
};
ClipperLib.ClipperBase.SlopesEqual5 = function (pt1, pt2, pt3, pt4) {
    return (pt1.Y - pt2.Y) * (pt3.X - pt4.X) - (pt1.X - pt2.X) * (pt3.Y - pt4.Y) === 0;
};
ClipperLib.ClipperBase.prototype.Clear = function () {
    var this$1 = this;

    this.DisposeLocalMinimaList();
    for (var i = 0, ilen = this.m_edges.length;i < ilen; ++i) {
        for (var j = 0, jlen = this.m_edges[i].length;j < jlen; ++j) 
            { this$1.m_edges[i][j] = null; }
        ClipperLib.Clear(this$1.m_edges[i]);
    }
    ClipperLib.Clear(this.m_edges);
    this.m_HasOpenPaths = false;
};
ClipperLib.ClipperBase.prototype.DisposeLocalMinimaList = function () {
    var this$1 = this;

    while (this.m_MinimaList !== null) {
        var tmpLm = this$1.m_MinimaList.Next;
        this$1.m_MinimaList = null;
        this$1.m_MinimaList = tmpLm;
    }
    this.m_CurrentLM = null;
};
ClipperLib.ClipperBase.prototype.RangeTest = function (pt) {
    if (pt.X > ClipperLib.ClipperBase.maxValue || pt.X < -ClipperLib.ClipperBase.maxValue || pt.Y > ClipperLib.ClipperBase.maxValue || pt.Y < -ClipperLib.ClipperBase.maxValue || pt.X > 0 && pt.X < ClipperLib.ClipperBase.minValue || pt.Y > 0 && pt.Y < ClipperLib.ClipperBase.minValue || pt.X < 0 && pt.X > -ClipperLib.ClipperBase.minValue || pt.Y < 0 && pt.Y > -ClipperLib.ClipperBase.minValue) 
        { ClipperLib.Error("Coordinate outside allowed range in RangeTest()."); }
};
ClipperLib.ClipperBase.prototype.InitEdge = function (e, eNext, ePrev, pt) {
    e.Next = eNext;
    e.Prev = ePrev;
    e.Curr.X = pt.X;
    e.Curr.Y = pt.Y;
    if (ClipperLib.use_xyz) 
        { e.Curr.Z = pt.Z; }
    e.OutIdx = -1;
};
ClipperLib.ClipperBase.prototype.InitEdge2 = function (e, polyType) {
    if (e.Curr.Y >= e.Next.Curr.Y) {
        e.Bot.X = e.Curr.X;
        e.Bot.Y = e.Curr.Y;
        if (ClipperLib.use_xyz) 
            { e.Bot.Z = e.Curr.Z; }
        e.Top.X = e.Next.Curr.X;
        e.Top.Y = e.Next.Curr.Y;
        if (ClipperLib.use_xyz) 
            { e.Top.Z = e.Next.Curr.Z; }
    } else {
        e.Top.X = e.Curr.X;
        e.Top.Y = e.Curr.Y;
        if (ClipperLib.use_xyz) 
            { e.Top.Z = e.Curr.Z; }
        e.Bot.X = e.Next.Curr.X;
        e.Bot.Y = e.Next.Curr.Y;
        if (ClipperLib.use_xyz) 
            { e.Bot.Z = e.Next.Curr.Z; }
    }
    this.SetDx(e);
    e.PolyTyp = polyType;
};
ClipperLib.ClipperBase.prototype.FindNextLocMin = function (E) {
    var E2;
    for (; ; ) {
        while (ClipperLib.FPoint.op_Inequality(E.Bot, E.Prev.Bot) || ClipperLib.FPoint.op_Equality(E.Curr, E.Top)) 
            { E = E.Next; }
        if (E.Dx !== ClipperLib.ClipperBase.horizontal && E.Prev.Dx !== ClipperLib.ClipperBase.horizontal) 
            { break; }
        while (E.Prev.Dx === ClipperLib.ClipperBase.horizontal) 
            { E = E.Prev; }
        E2 = E;
        while (E.Dx === ClipperLib.ClipperBase.horizontal) 
            { E = E.Next; }
        if (E.Top.Y === E.Prev.Bot.Y) 
            { continue; }
        if (E2.Prev.Bot.X < E.Bot.X) 
            { E = E2; }
        break;
    }
    return E;
};
ClipperLib.ClipperBase.prototype.ProcessBound = function (E, LeftBoundIsForward) {
    var this$1 = this;

    var EStart;
    var Result = E;
    var Horz;
    if (Result.OutIdx === ClipperLib.ClipperBase.Skip) {
        E = Result;
        if (LeftBoundIsForward) {
            while (E.Top.Y === E.Next.Bot.Y) 
                { E = E.Next; }
            while (E !== Result && E.Dx === ClipperLib.ClipperBase.horizontal) 
                { E = E.Prev; }
        } else {
            while (E.Top.Y === E.Prev.Bot.Y) 
                { E = E.Prev; }
            while (E !== Result && E.Dx === ClipperLib.ClipperBase.horizontal) 
                { E = E.Next; }
        }
        if (E === Result) {
            if (LeftBoundIsForward) 
                { Result = E.Next; }
             else 
                { Result = E.Prev; }
        } else {
            if (LeftBoundIsForward) 
                { E = Result.Next; }
             else 
                { E = Result.Prev; }
            var locMin = new ClipperLib.LocalMinima();
            locMin.Next = null;
            locMin.Y = E.Bot.Y;
            locMin.LeftBound = null;
            locMin.RightBound = E;
            E.WindDelta = 0;
            Result = this.ProcessBound(E, LeftBoundIsForward);
            this.InsertLocalMinima(locMin);
        }
        return Result;
    }
    if (E.Dx === ClipperLib.ClipperBase.horizontal) {
        if (LeftBoundIsForward) 
            { EStart = E.Prev; }
         else 
            { EStart = E.Next; }
        if (EStart.Dx === ClipperLib.ClipperBase.horizontal) {
            if (EStart.Bot.X !== E.Bot.X && EStart.Top.X !== E.Bot.X) 
                { this.ReverseHorizontal(E); }
        } else if (EStart.Bot.X !== E.Bot.X) 
            { this.ReverseHorizontal(E); }
    }
    EStart = E;
    if (LeftBoundIsForward) {
        while (Result.Top.Y === Result.Next.Bot.Y && Result.Next.OutIdx !== ClipperLib.ClipperBase.Skip) 
            { Result = Result.Next; }
        if (Result.Dx === ClipperLib.ClipperBase.horizontal && Result.Next.OutIdx !== ClipperLib.ClipperBase.Skip) {
            Horz = Result;
            while (Horz.Prev.Dx === ClipperLib.ClipperBase.horizontal) 
                { Horz = Horz.Prev; }
            if (Horz.Prev.Top.X > Result.Next.Top.X) 
                { Result = Horz.Prev; }
        }
        while (E !== Result) {
            E.NextInLML = E.Next;
            if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Prev.Top.X) 
                { this$1.ReverseHorizontal(E); }
            E = E.Next;
        }
        if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Prev.Top.X) 
            { this.ReverseHorizontal(E); }
        Result = Result.Next;
    } else {
        while (Result.Top.Y === Result.Prev.Bot.Y && Result.Prev.OutIdx !== ClipperLib.ClipperBase.Skip) 
            { Result = Result.Prev; }
        if (Result.Dx === ClipperLib.ClipperBase.horizontal && Result.Prev.OutIdx !== ClipperLib.ClipperBase.Skip) {
            Horz = Result;
            while (Horz.Next.Dx === ClipperLib.ClipperBase.horizontal) 
                { Horz = Horz.Next; }
            if (Horz.Next.Top.X === Result.Prev.Top.X || Horz.Next.Top.X > Result.Prev.Top.X) {
                Result = Horz.Next;
            }
        }
        while (E !== Result) {
            E.NextInLML = E.Prev;
            if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Next.Top.X) 
                { this$1.ReverseHorizontal(E); }
            E = E.Prev;
        }
        if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Next.Top.X) 
            { this.ReverseHorizontal(E); }
        Result = Result.Prev;
    }
    return Result;
};
ClipperLib.ClipperBase.prototype.AddPath = function (pg, polyType, Closed) {
    var this$1 = this;

    if (ClipperLib.use_lines) {
        if (!Closed && polyType === ClipperLib.PolyType.ptClip) 
            { ClipperLib.Error("AddPath: Open paths must be subject."); }
    } else {
        if (!Closed) 
            { ClipperLib.Error("AddPath: Open paths have been disabled."); }
    }
    var highI = pg.length - 1;
    if (Closed) 
        { while (highI > 0 && ClipperLib.FPoint.op_Equality(pg[highI], pg[0])) 
        { --highI; } }
    while (highI > 0 && ClipperLib.FPoint.op_Equality(pg[highI], pg[highI - 1])) 
        { --highI; }
    if (Closed && highI < 2 || !Closed && highI < 1) 
        { return false; }
    var edges = new Array();
    for (var i = 0;i <= highI; i++) 
        { edges.push(new ClipperLib.TEdge()); }
    var IsFlat = true;
    edges[1].Curr.X = pg[1].X;
    edges[1].Curr.Y = pg[1].Y;
    if (ClipperLib.use_xyz) 
        { edges[1].Curr.Z = pg[1].Z; }
    this.RangeTest(pg[0]);
    this.RangeTest(pg[highI]);
    this.InitEdge(edges[0], edges[1], edges[highI], pg[0]);
    this.InitEdge(edges[highI], edges[0], edges[highI - 1], pg[highI]);
    for (var i = highI - 1;i >= 1; --i) {
        this$1.RangeTest(pg[i]);
        this$1.InitEdge(edges[i], edges[i + 1], edges[i - 1], pg[i]);
    }
    var eStart = edges[0];
    var E = eStart, eLoopStop = eStart;
    for (; ; ) {
        if (E.Curr === E.Next.Curr && (Closed || E.Next !== eStart)) {
            if (E === E.Next) 
                { break; }
            if (E === eStart) 
                { eStart = E.Next; }
            E = this$1.RemoveEdge(E);
            eLoopStop = E;
            continue;
        }
        if (E.Prev === E.Next) 
            { break; }
         else if (Closed && ClipperLib.ClipperBase.SlopesEqual4(E.Prev.Curr, E.Curr, E.Next.Curr) && (!this$1.PreserveCollinear || !this$1.Pt2IsBetweenPt1AndPt3(E.Prev.Curr, E.Curr, E.Next.Curr))) {
            if (E === eStart) 
                { eStart = E.Next; }
            E = this$1.RemoveEdge(E);
            E = E.Prev;
            eLoopStop = E;
            continue;
        }
        E = E.Next;
        if (E === eLoopStop || !Closed && E.Next === eStart) 
            { break; }
    }
    if (!Closed && E === E.Next || Closed && E.Prev === E.Next) 
        { return false; }
    if (!Closed) {
        this.m_HasOpenPaths = true;
        eStart.Prev.OutIdx = ClipperLib.ClipperBase.Skip;
    }
    E = eStart;
    do {
        this$1.InitEdge2(E, polyType);
        E = E.Next;
        if (IsFlat && E.Curr.Y !== eStart.Curr.Y) 
            { IsFlat = false; }
    } while (E !== eStart);
    if (IsFlat) {
        if (Closed) 
            { return false; }
        E.Prev.OutIdx = ClipperLib.ClipperBase.Skip;
        var locMin = new ClipperLib.LocalMinima();
        locMin.Next = null;
        locMin.Y = E.Bot.Y;
        locMin.LeftBound = null;
        locMin.RightBound = E;
        locMin.RightBound.Side = ClipperLib.EdgeSide.esRight;
        locMin.RightBound.WindDelta = 0;
        for (; ; ) {
            if (E.Bot.X !== E.Prev.Top.X) 
                { this$1.ReverseHorizontal(E); }
            if (E.Next.OutIdx === ClipperLib.ClipperBase.Skip) 
                { break; }
            E.NextInLML = E.Next;
            E = E.Next;
        }
        this.InsertLocalMinima(locMin);
        this.m_edges.push(edges);
        return true;
    }
    this.m_edges.push(edges);
    var leftBoundIsForward;
    var EMin = null;
    if (ClipperLib.FPoint.op_Equality(E.Prev.Bot, E.Prev.Top)) 
        { E = E.Next; }
    for (; ; ) {
        E = this$1.FindNextLocMin(E);
        if (E === EMin) 
            { break; }
         else if (EMin === null) 
            { EMin = E; }
        var locMin = new ClipperLib.LocalMinima();
        locMin.Next = null;
        locMin.Y = E.Bot.Y;
        if (E.Dx < E.Prev.Dx) {
            locMin.LeftBound = E.Prev;
            locMin.RightBound = E;
            leftBoundIsForward = false;
        } else {
            locMin.LeftBound = E;
            locMin.RightBound = E.Prev;
            leftBoundIsForward = true;
        }
        locMin.LeftBound.Side = ClipperLib.EdgeSide.esLeft;
        locMin.RightBound.Side = ClipperLib.EdgeSide.esRight;
        if (!Closed) 
            { locMin.LeftBound.WindDelta = 0; }
         else if (locMin.LeftBound.Next === locMin.RightBound) 
            { locMin.LeftBound.WindDelta = -1; }
         else 
            { locMin.LeftBound.WindDelta = 1; }
        locMin.RightBound.WindDelta = -locMin.LeftBound.WindDelta;
        E = this$1.ProcessBound(locMin.LeftBound, leftBoundIsForward);
        if (E.OutIdx === ClipperLib.ClipperBase.Skip) 
            { E = this$1.ProcessBound(E, leftBoundIsForward); }
        var E2 = this$1.ProcessBound(locMin.RightBound, !leftBoundIsForward);
        if (E2.OutIdx === ClipperLib.ClipperBase.Skip) 
            { E2 = this$1.ProcessBound(E2, !leftBoundIsForward); }
        if (locMin.LeftBound.OutIdx === ClipperLib.ClipperBase.Skip) 
            { locMin.LeftBound = null; }
         else if (locMin.RightBound.OutIdx === ClipperLib.ClipperBase.Skip) 
            { locMin.RightBound = null; }
        this$1.InsertLocalMinima(locMin);
        if (!leftBoundIsForward) 
            { E = E2; }
    }
    return true;
};
ClipperLib.ClipperBase.prototype.AddPaths = function (ppg, polyType, closed) {
    var this$1 = this;

    var result = false;
    for (var i = 0, ilen = ppg.length;i < ilen; ++i) 
        { if (this$1.AddPath(ppg[i], polyType, closed)) 
        { result = true; } }
    return result;
};
ClipperLib.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3 = function (pt1, pt2, pt3) {
    if (ClipperLib.FPoint.op_Equality(pt1, pt3) || ClipperLib.FPoint.op_Equality(pt1, pt2) || ClipperLib.FPoint.op_Equality(pt3, pt2)) 
        { return false; }
     else if (pt1.X !== pt3.X) 
        { return pt2.X > pt1.X === pt2.X < pt3.X; }
     else 
        { return pt2.Y > pt1.Y === pt2.Y < pt3.Y; }
};
ClipperLib.ClipperBase.prototype.RemoveEdge = function (e) {
    e.Prev.Next = e.Next;
    e.Next.Prev = e.Prev;
    var result = e.Next;
    e.Prev = null;
    return result;
};
ClipperLib.ClipperBase.prototype.SetDx = function (e) {
    e.Delta.X = e.Top.X - e.Bot.X;
    e.Delta.Y = e.Top.Y - e.Bot.Y;
    if (e.Delta.Y === 0) 
        { e.Dx = ClipperLib.ClipperBase.horizontal; }
     else 
        { e.Dx = e.Delta.X / e.Delta.Y; }
};
ClipperLib.ClipperBase.prototype.InsertLocalMinima = function (newLm) {
    if (this.m_MinimaList === null) {
        this.m_MinimaList = newLm;
    } else if (newLm.Y >= this.m_MinimaList.Y) {
        newLm.Next = this.m_MinimaList;
        this.m_MinimaList = newLm;
    } else {
        var tmpLm = this.m_MinimaList;
        while (tmpLm.Next !== null && newLm.Y < tmpLm.Next.Y) 
            { tmpLm = tmpLm.Next; }
        newLm.Next = tmpLm.Next;
        tmpLm.Next = newLm;
    }
};
ClipperLib.ClipperBase.prototype.PopLocalMinima = function (Y, current) {
    current.v = this.m_CurrentLM;
    if (this.m_CurrentLM !== null && this.m_CurrentLM.Y === Y) {
        this.m_CurrentLM = this.m_CurrentLM.Next;
        return true;
    }
    return false;
};
ClipperLib.ClipperBase.prototype.ReverseHorizontal = function (e) {
    var tmp = e.Top.X;
    e.Top.X = e.Bot.X;
    e.Bot.X = tmp;
    if (ClipperLib.use_xyz) {
        tmp = e.Top.Z;
        e.Top.Z = e.Bot.Z;
        e.Bot.Z = tmp;
    }
};
ClipperLib.ClipperBase.prototype.Reset = function () {
    var this$1 = this;

    this.m_CurrentLM = this.m_MinimaList;
    if (this.m_CurrentLM === null) 
        { return; }
    this.m_Scanbeam = null;
    var lm = this.m_MinimaList;
    while (lm !== null) {
        this$1.InsertScanbeam(lm.Y);
        var e = lm.LeftBound;
        if (e !== null) {
            e.Curr.X = e.Bot.X;
            e.Curr.Y = e.Bot.Y;
            if (ClipperLib.use_xyz) 
                { e.Curr.Z = e.Bot.Z; }
            e.OutIdx = ClipperLib.ClipperBase.Unassigned;
        }
        e = lm.RightBound;
        if (e !== null) {
            e.Curr.X = e.Bot.X;
            e.Curr.Y = e.Bot.Y;
            if (ClipperLib.use_xyz) 
                { e.Curr.Z = e.Bot.Z; }
            e.OutIdx = ClipperLib.ClipperBase.Unassigned;
        }
        lm = lm.Next;
    }
    this.m_ActiveEdges = null;
};
ClipperLib.ClipperBase.prototype.InsertScanbeam = function (Y) {
    if (this.m_Scanbeam === null) {
        this.m_Scanbeam = new ClipperLib.Scanbeam();
        this.m_Scanbeam.Next = null;
        this.m_Scanbeam.Y = Y;
    } else if (Y > this.m_Scanbeam.Y) {
        var newSb = new ClipperLib.Scanbeam();
        newSb.Y = Y;
        newSb.Next = this.m_Scanbeam;
        this.m_Scanbeam = newSb;
    } else {
        var sb2 = this.m_Scanbeam;
        while (sb2.Next !== null && Y <= sb2.Next.Y) {
            sb2 = sb2.Next;
        }
        if (Y === sb2.Y) {
            return;
        }
        var newSb1 = new ClipperLib.Scanbeam();
        newSb1.Y = Y;
        newSb1.Next = sb2.Next;
        sb2.Next = newSb1;
    }
};
ClipperLib.ClipperBase.prototype.PopScanbeam = function (Y) {
    if (this.m_Scanbeam === null) {
        Y.v = 0;
        return false;
    }
    Y.v = this.m_Scanbeam.Y;
    this.m_Scanbeam = this.m_Scanbeam.Next;
    return true;
};
ClipperLib.ClipperBase.prototype.LocalMinimaPending = function () {
    return this.m_CurrentLM !== null;
};
ClipperLib.ClipperBase.prototype.CreateOutRec = function () {
    var result = new ClipperLib.OutRec();
    result.Idx = ClipperLib.ClipperBase.Unassigned;
    result.IsHole = false;
    result.IsOpen = false;
    result.FirstLeft = null;
    result.Pts = null;
    result.BottomPt = null;
    result.PolyNode = null;
    this.m_PolyOuts.push(result);
    result.Idx = this.m_PolyOuts.length - 1;
    return result;
};
ClipperLib.ClipperBase.prototype.DisposeOutRec = function (index) {
    var outRec = this.m_PolyOuts[index];
    outRec.Pts = null;
    outRec = null;
    this.m_PolyOuts[index] = null;
};
ClipperLib.ClipperBase.prototype.UpdateEdgeIntoAEL = function (e) {
    if (e.NextInLML === null) {
        ClipperLib.Error("UpdateEdgeIntoAEL: invalid call");
    }
    var AelPrev = e.PrevInAEL;
    var AelNext = e.NextInAEL;
    e.NextInLML.OutIdx = e.OutIdx;
    if (AelPrev !== null) {
        AelPrev.NextInAEL = e.NextInLML;
    } else {
        this.m_ActiveEdges = e.NextInLML;
    }
    if (AelNext !== null) {
        AelNext.PrevInAEL = e.NextInLML;
    }
    e.NextInLML.Side = e.Side;
    e.NextInLML.WindDelta = e.WindDelta;
    e.NextInLML.WindCnt = e.WindCnt;
    e.NextInLML.WindCnt2 = e.WindCnt2;
    e = e.NextInLML;
    e.Curr.X = e.Bot.X;
    e.Curr.Y = e.Bot.Y;
    e.PrevInAEL = AelPrev;
    e.NextInAEL = AelNext;
    if (!ClipperLib.ClipperBase.IsHorizontal(e)) {
        this.InsertScanbeam(e.Top.Y);
    }
    return e;
};
ClipperLib.ClipperBase.prototype.SwapPositionsInAEL = function (edge1, edge2) {
    if (edge1.NextInAEL === edge1.PrevInAEL || edge2.NextInAEL === edge2.PrevInAEL) {
        return;
    }
    if (edge1.NextInAEL === edge2) {
        var next = edge2.NextInAEL;
        if (next !== null) {
            next.PrevInAEL = edge1;
        }
        var prev = edge1.PrevInAEL;
        if (prev !== null) {
            prev.NextInAEL = edge2;
        }
        edge2.PrevInAEL = prev;
        edge2.NextInAEL = edge1;
        edge1.PrevInAEL = edge2;
        edge1.NextInAEL = next;
    } else if (edge2.NextInAEL === edge1) {
        var next1 = edge1.NextInAEL;
        if (next1 !== null) {
            next1.PrevInAEL = edge2;
        }
        var prev1 = edge2.PrevInAEL;
        if (prev1 !== null) {
            prev1.NextInAEL = edge1;
        }
        edge1.PrevInAEL = prev1;
        edge1.NextInAEL = edge2;
        edge2.PrevInAEL = edge1;
        edge2.NextInAEL = next1;
    } else {
        var next2 = edge1.NextInAEL;
        var prev2 = edge1.PrevInAEL;
        edge1.NextInAEL = edge2.NextInAEL;
        if (edge1.NextInAEL !== null) {
            edge1.NextInAEL.PrevInAEL = edge1;
        }
        edge1.PrevInAEL = edge2.PrevInAEL;
        if (edge1.PrevInAEL !== null) {
            edge1.PrevInAEL.NextInAEL = edge1;
        }
        edge2.NextInAEL = next2;
        if (edge2.NextInAEL !== null) {
            edge2.NextInAEL.PrevInAEL = edge2;
        }
        edge2.PrevInAEL = prev2;
        if (edge2.PrevInAEL !== null) {
            edge2.PrevInAEL.NextInAEL = edge2;
        }
    }
    if (edge1.PrevInAEL === null) {
        this.m_ActiveEdges = edge1;
    } else {
        if (edge2.PrevInAEL === null) {
            this.m_ActiveEdges = edge2;
        }
    }
};
ClipperLib.ClipperBase.prototype.DeleteFromAEL = function (e) {
    var AelPrev = e.PrevInAEL;
    var AelNext = e.NextInAEL;
    if (AelPrev === null && AelNext === null && e !== this.m_ActiveEdges) {
        return;
    }
    if (AelPrev !== null) {
        AelPrev.NextInAEL = AelNext;
    } else {
        this.m_ActiveEdges = AelNext;
    }
    if (AelNext !== null) {
        AelNext.PrevInAEL = AelPrev;
    }
    e.NextInAEL = null;
    e.PrevInAEL = null;
};
ClipperLib.Clipper = function (InitOptions) {
    if (typeof InitOptions === "undefined") 
        { InitOptions = 0; }
    this.m_PolyOuts = null;
    this.m_ClipType = ClipperLib.ClipType.ctIntersection;
    this.m_Scanbeam = null;
    this.m_Maxima = null;
    this.m_ActiveEdges = null;
    this.m_SortedEdges = null;
    this.m_IntersectList = null;
    this.m_IntersectNodeComparer = null;
    this.m_ExecuteLocked = false;
    this.m_ClipFillType = ClipperLib.PolyFillType.pftEvenOdd;
    this.m_SubjFillType = ClipperLib.PolyFillType.pftEvenOdd;
    this.m_Joins = null;
    this.m_GhostJoins = null;
    this.m_UsingPolyTree = false;
    this.ReverseSolution = false;
    this.StrictlySimple = false;
    ClipperLib.ClipperBase.call(this);
    this.m_Scanbeam = null;
    this.m_Maxima = null;
    this.m_ActiveEdges = null;
    this.m_SortedEdges = null;
    this.m_IntersectList = new Array();
    this.m_IntersectNodeComparer = ClipperLib.MyIntersectNodeSort.Compare;
    this.m_ExecuteLocked = false;
    this.m_UsingPolyTree = false;
    this.m_PolyOuts = new Array();
    this.m_Joins = new Array();
    this.m_GhostJoins = new Array();
    this.ReverseSolution = (1 & InitOptions) !== 0;
    this.StrictlySimple = (2 & InitOptions) !== 0;
    this.PreserveCollinear = (4 & InitOptions) !== 0;
    if (ClipperLib.use_xyz) {
        this.ZFillFunction = null;
    }
};
ClipperLib.Clipper.ioReverseSolution = 1;
ClipperLib.Clipper.ioStrictlySimple = 2;
ClipperLib.Clipper.ioPreserveCollinear = 4;
ClipperLib.Clipper.prototype.Clear = function () {
    if (this.m_edges.length === 0) 
        { return; }
    this.DisposeAllPolyPts();
    ClipperLib.ClipperBase.prototype.Clear.call(this);
};
ClipperLib.Clipper.prototype.InsertMaxima = function (X) {
    var newMax = new ClipperLib.Maxima();
    newMax.X = X;
    if (this.m_Maxima === null) {
        this.m_Maxima = newMax;
        this.m_Maxima.Next = null;
        this.m_Maxima.Prev = null;
    } else if (X < this.m_Maxima.X) {
        newMax.Next = this.m_Maxima;
        newMax.Prev = null;
        this.m_Maxima = newMax;
    } else {
        var m = this.m_Maxima;
        while (m.Next !== null && X >= m.Next.X) {
            m = m.Next;
        }
        if (X === m.X) {
            return;
        }
        newMax.Next = m.Next;
        newMax.Prev = m;
        if (m.Next !== null) {
            m.Next.Prev = newMax;
        }
        m.Next = newMax;
    }
};
ClipperLib.Clipper.prototype.Execute = function () {
    var a = arguments, alen = a.length, ispolytree = a[1] instanceof ClipperLib.PolyTree;
    if (alen === 4 && !ispolytree) {
        var clipType = a[0], solution = a[1], subjFillType = a[2], clipFillType = a[3];
        if (this.m_ExecuteLocked) 
            { return false; }
        if (this.m_HasOpenPaths) 
            { ClipperLib.Error("Error: PolyTree struct is needed for open path clipping."); }
        this.m_ExecuteLocked = true;
        ClipperLib.Clear(solution);
        this.m_SubjFillType = subjFillType;
        this.m_ClipFillType = clipFillType;
        this.m_ClipType = clipType;
        this.m_UsingPolyTree = false;
        try {
            var succeeded = this.ExecuteInternal();
            if (succeeded) 
                { this.BuildResult(solution); }
        } finally {
            this.DisposeAllPolyPts();
            this.m_ExecuteLocked = false;
        }
        return succeeded;
    } else if (alen === 4 && ispolytree) {
        var clipType = a[0], polytree = a[1], subjFillType = a[2], clipFillType = a[3];
        if (this.m_ExecuteLocked) 
            { return false; }
        this.m_ExecuteLocked = true;
        this.m_SubjFillType = subjFillType;
        this.m_ClipFillType = clipFillType;
        this.m_ClipType = clipType;
        this.m_UsingPolyTree = true;
        try {
            var succeeded = this.ExecuteInternal();
            if (succeeded) 
                { this.BuildResult2(polytree); }
        } finally {
            this.DisposeAllPolyPts();
            this.m_ExecuteLocked = false;
        }
        return succeeded;
    } else if (alen === 2 && !ispolytree) {
        var clipType = a[0], solution = a[1];
        return this.Execute(clipType, solution, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
    } else if (alen === 2 && ispolytree) {
        var clipType = a[0], polytree = a[1];
        return this.Execute(clipType, polytree, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
    }
};
ClipperLib.Clipper.prototype.FixHoleLinkage = function (outRec) {
    if (outRec.FirstLeft === null || outRec.IsHole !== outRec.FirstLeft.IsHole && outRec.FirstLeft.Pts !== null) 
        { return; }
    var orfl = outRec.FirstLeft;
    while (orfl !== null && (orfl.IsHole === outRec.IsHole || orfl.Pts === null)) 
        { orfl = orfl.FirstLeft; }
    outRec.FirstLeft = orfl;
};
ClipperLib.Clipper.prototype.ExecuteInternal = function () {
    var this$1 = this;

    try {
        this.Reset();
        this.m_SortedEdges = null;
        this.m_Maxima = null;
        var botY = {}, topY = {};
        if (!this.PopScanbeam(botY)) {
            return false;
        }
        this.InsertLocalMinimaIntoAEL(botY.v);
        while (this.PopScanbeam(topY) || this.LocalMinimaPending()) {
            this$1.ProcessHorizontals();
            this$1.m_GhostJoins.length = 0;
            if (!this$1.ProcessIntersections(topY.v)) {
                return false;
            }
            this$1.ProcessEdgesAtTopOfScanbeam(topY.v);
            botY.v = topY.v;
            this$1.InsertLocalMinimaIntoAEL(botY.v);
        }
        var outRec, i, ilen;
        for (i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            outRec = this$1.m_PolyOuts[i];
            if (outRec.Pts === null || outRec.IsOpen) 
                { continue; }
            if ((outRec.IsHole ^ this$1.ReverseSolution) == this$1.Area$1(outRec) > 0) 
                { this$1.ReversePolyPtLinks(outRec.Pts); }
        }
        this.JoinCommonEdges();
        for (i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++) {
            outRec = this$1.m_PolyOuts[i];
            if (outRec.Pts === null) 
                { continue; }
             else if (outRec.IsOpen) 
                { this$1.FixupOutPolyline(outRec); }
             else 
                { this$1.FixupOutPolygon(outRec); }
        }
        if (this.StrictlySimple) 
            { this.DoSimplePolygons(); }
        return true;
    } finally {
        this.m_Joins.length = 0;
        this.m_GhostJoins.length = 0;
    }
};
ClipperLib.Clipper.prototype.DisposeAllPolyPts = function () {
    var this$1 = this;

    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; ++i) 
        { this$1.DisposeOutRec(i); }
    ClipperLib.Clear(this.m_PolyOuts);
};
ClipperLib.Clipper.prototype.AddJoin = function (Op1, Op2, OffPt) {
    var j = new ClipperLib.Join();
    j.OutPt1 = Op1;
    j.OutPt2 = Op2;
    j.OffPt.X = OffPt.X;
    j.OffPt.Y = OffPt.Y;
    if (ClipperLib.use_xyz) 
        { j.OffPt.Z = OffPt.Z; }
    this.m_Joins.push(j);
};
ClipperLib.Clipper.prototype.AddGhostJoin = function (Op, OffPt) {
    var j = new ClipperLib.Join();
    j.OutPt1 = Op;
    j.OffPt.X = OffPt.X;
    j.OffPt.Y = OffPt.Y;
    if (ClipperLib.use_xyz) 
        { j.OffPt.Z = OffPt.Z; }
    this.m_GhostJoins.push(j);
};
ClipperLib.Clipper.prototype.SetZ = function (pt, e1, e2) {
    if (this.ZFillFunction !== null) {
        if (pt.Z !== 0 || this.ZFillFunction === null) 
            { return; }
         else if (ClipperLib.FPoint.op_Equality(pt, e1.Bot)) 
            { pt.Z = e1.Bot.Z; }
         else if (ClipperLib.FPoint.op_Equality(pt, e1.Top)) 
            { pt.Z = e1.Top.Z; }
         else if (ClipperLib.FPoint.op_Equality(pt, e2.Bot)) 
            { pt.Z = e2.Bot.Z; }
         else if (ClipperLib.FPoint.op_Equality(pt, e2.Top)) 
            { pt.Z = e2.Top.Z; }
         else 
            { this.ZFillFunction(e1.Bot, e1.Top, e2.Bot, e2.Top, pt); }
    }
};
ClipperLib.Clipper.prototype.InsertLocalMinimaIntoAEL = function (botY) {
    var this$1 = this;

    var lm = {};
    var lb;
    var rb;
    while (this.PopLocalMinima(botY, lm)) {
        lb = lm.v.LeftBound;
        rb = lm.v.RightBound;
        var Op1 = null;
        if (lb === null) {
            this$1.InsertEdgeIntoAEL(rb, null);
            this$1.SetWindingCount(rb);
            if (this$1.IsContributing(rb)) 
                { Op1 = this$1.AddOutPt(rb, rb.Bot); }
        } else if (rb === null) {
            this$1.InsertEdgeIntoAEL(lb, null);
            this$1.SetWindingCount(lb);
            if (this$1.IsContributing(lb)) 
                { Op1 = this$1.AddOutPt(lb, lb.Bot); }
            this$1.InsertScanbeam(lb.Top.Y);
        } else {
            this$1.InsertEdgeIntoAEL(lb, null);
            this$1.InsertEdgeIntoAEL(rb, lb);
            this$1.SetWindingCount(lb);
            rb.WindCnt = lb.WindCnt;
            rb.WindCnt2 = lb.WindCnt2;
            if (this$1.IsContributing(lb)) 
                { Op1 = this$1.AddLocalMinPoly(lb, rb, lb.Bot); }
            this$1.InsertScanbeam(lb.Top.Y);
        }
        if (rb !== null) {
            if (ClipperLib.ClipperBase.IsHorizontal(rb)) {
                if (rb.NextInLML !== null) {
                    this$1.InsertScanbeam(rb.NextInLML.Top.Y);
                }
                this$1.AddEdgeToSEL(rb);
            } else {
                this$1.InsertScanbeam(rb.Top.Y);
            }
        }
        if (lb === null || rb === null) 
            { continue; }
        if (Op1 !== null && ClipperLib.ClipperBase.IsHorizontal(rb) && this$1.m_GhostJoins.length > 0 && rb.WindDelta !== 0) {
            for (var i = 0, ilen = this.m_GhostJoins.length;i < ilen; i++) {
                var j = this$1.m_GhostJoins[i];
                if (this$1.HorzSegmentsOverlap(j.OutPt1.Pt.X, j.OffPt.X, rb.Bot.X, rb.Top.X)) 
                    { this$1.AddJoin(j.OutPt1, Op1, j.OffPt); }
            }
        }
        if (lb.OutIdx >= 0 && lb.PrevInAEL !== null && lb.PrevInAEL.Curr.X === lb.Bot.X && lb.PrevInAEL.OutIdx >= 0 && ClipperLib.ClipperBase.SlopesEqual5(lb.PrevInAEL.Curr, lb.PrevInAEL.Top, lb.Curr, lb.Top) && lb.WindDelta !== 0 && lb.PrevInAEL.WindDelta !== 0) {
            var Op2 = this$1.AddOutPt(lb.PrevInAEL, lb.Bot);
            this$1.AddJoin(Op1, Op2, lb.Top);
        }
        if (lb.NextInAEL !== rb) {
            if (rb.OutIdx >= 0 && rb.PrevInAEL.OutIdx >= 0 && ClipperLib.ClipperBase.SlopesEqual5(rb.PrevInAEL.Curr, rb.PrevInAEL.Top, rb.Curr, rb.Top) && rb.WindDelta !== 0 && rb.PrevInAEL.WindDelta !== 0) {
                var Op2 = this$1.AddOutPt(rb.PrevInAEL, rb.Bot);
                this$1.AddJoin(Op1, Op2, rb.Top);
            }
            var e = lb.NextInAEL;
            if (e !== null) 
                { while (e !== rb) {
                this$1.IntersectEdges(rb, e, lb.Curr);
                e = e.NextInAEL;
            } }
        }
    }
};
ClipperLib.Clipper.prototype.InsertEdgeIntoAEL = function (edge, startEdge) {
    if (this.m_ActiveEdges === null) {
        edge.PrevInAEL = null;
        edge.NextInAEL = null;
        this.m_ActiveEdges = edge;
    } else if (startEdge === null && this.E2InsertsBeforeE1(this.m_ActiveEdges, edge)) {
        edge.PrevInAEL = null;
        edge.NextInAEL = this.m_ActiveEdges;
        this.m_ActiveEdges.PrevInAEL = edge;
        this.m_ActiveEdges = edge;
    } else {
        if (startEdge === null) 
            { startEdge = this.m_ActiveEdges; }
        while (startEdge.NextInAEL !== null && !this.E2InsertsBeforeE1(startEdge.NextInAEL, edge)) 
            { startEdge = startEdge.NextInAEL; }
        edge.NextInAEL = startEdge.NextInAEL;
        if (startEdge.NextInAEL !== null) 
            { startEdge.NextInAEL.PrevInAEL = edge; }
        edge.PrevInAEL = startEdge;
        startEdge.NextInAEL = edge;
    }
};
ClipperLib.Clipper.prototype.E2InsertsBeforeE1 = function (e1, e2) {
    if (e2.Curr.X === e1.Curr.X) {
        if (e2.Top.Y > e1.Top.Y) 
            { return e2.Top.X < ClipperLib.Clipper.TopX(e1, e2.Top.Y); }
         else 
            { return e1.Top.X > ClipperLib.Clipper.TopX(e2, e1.Top.Y); }
    } else 
        { return e2.Curr.X < e1.Curr.X; }
};
ClipperLib.Clipper.prototype.IsEvenOddFillType = function (edge) {
    if (edge.PolyTyp === ClipperLib.PolyType.ptSubject) 
        { return this.m_SubjFillType === ClipperLib.PolyFillType.pftEvenOdd; }
     else 
        { return this.m_ClipFillType === ClipperLib.PolyFillType.pftEvenOdd; }
};
ClipperLib.Clipper.prototype.IsEvenOddAltFillType = function (edge) {
    if (edge.PolyTyp === ClipperLib.PolyType.ptSubject) 
        { return this.m_ClipFillType === ClipperLib.PolyFillType.pftEvenOdd; }
     else 
        { return this.m_SubjFillType === ClipperLib.PolyFillType.pftEvenOdd; }
};
ClipperLib.Clipper.prototype.IsContributing = function (edge) {
    var pft, pft2;
    if (edge.PolyTyp === ClipperLib.PolyType.ptSubject) {
        pft = this.m_SubjFillType;
        pft2 = this.m_ClipFillType;
    } else {
        pft = this.m_ClipFillType;
        pft2 = this.m_SubjFillType;
    }
    switch (pft) {
        case ClipperLib.PolyFillType.pftEvenOdd:
            if (edge.WindDelta === 0 && edge.WindCnt !== 1) 
                { return false; }
            break;
        case ClipperLib.PolyFillType.pftNonZero:
            if (Math.abs(edge.WindCnt) !== 1) 
                { return false; }
            break;
        case ClipperLib.PolyFillType.pftPositive:
            if (edge.WindCnt !== 1) 
                { return false; }
            break;
        default:
            if (edge.WindCnt !== -1) 
                { return false; }
            break;
    }
    switch (this.m_ClipType) {
        case ClipperLib.ClipType.ctIntersection:
            switch (pft2) {
                case ClipperLib.PolyFillType.pftEvenOdd:
                case ClipperLib.PolyFillType.pftNonZero:
                    return edge.WindCnt2 !== 0;
                case ClipperLib.PolyFillType.pftPositive:
                    return edge.WindCnt2 > 0;
                default:
                    return edge.WindCnt2 < 0;
            }
        case ClipperLib.ClipType.ctUnion:
            switch (pft2) {
                case ClipperLib.PolyFillType.pftEvenOdd:
                case ClipperLib.PolyFillType.pftNonZero:
                    return edge.WindCnt2 === 0;
                case ClipperLib.PolyFillType.pftPositive:
                    return edge.WindCnt2 <= 0;
                default:
                    return edge.WindCnt2 >= 0;
            }
        case ClipperLib.ClipType.ctDifference:
            if (edge.PolyTyp === ClipperLib.PolyType.ptSubject) 
                { switch (pft2) {
                case ClipperLib.PolyFillType.pftEvenOdd:
                case ClipperLib.PolyFillType.pftNonZero:
                    return edge.WindCnt2 === 0;
                case ClipperLib.PolyFillType.pftPositive:
                    return edge.WindCnt2 <= 0;
                default:
                    return edge.WindCnt2 >= 0;
            } }
             else 
                { switch (pft2) {
                case ClipperLib.PolyFillType.pftEvenOdd:
                case ClipperLib.PolyFillType.pftNonZero:
                    return edge.WindCnt2 !== 0;
                case ClipperLib.PolyFillType.pftPositive:
                    return edge.WindCnt2 > 0;
                default:
                    return edge.WindCnt2 < 0;
            } }
        case ClipperLib.ClipType.ctXor:
            if (edge.WindDelta === 0) 
                { switch (pft2) {
                case ClipperLib.PolyFillType.pftEvenOdd:
                case ClipperLib.PolyFillType.pftNonZero:
                    return edge.WindCnt2 === 0;
                case ClipperLib.PolyFillType.pftPositive:
                    return edge.WindCnt2 <= 0;
                default:
                    return edge.WindCnt2 >= 0;
            } }
             else 
                { return true; }
    }
    return true;
};
ClipperLib.Clipper.prototype.SetWindingCount = function (edge) {
    var e = edge.PrevInAEL;
    while (e !== null && (e.PolyTyp !== edge.PolyTyp || e.WindDelta === 0)) 
        { e = e.PrevInAEL; }
    if (e === null) {
        var pft = edge.PolyTyp === ClipperLib.PolyType.ptSubject ? this.m_SubjFillType : this.m_ClipFillType;
        if (edge.WindDelta === 0) {
            edge.WindCnt = pft === ClipperLib.PolyFillType.pftNegative ? -1 : 1;
        } else {
            edge.WindCnt = edge.WindDelta;
        }
        edge.WindCnt2 = 0;
        e = this.m_ActiveEdges;
    } else if (edge.WindDelta === 0 && this.m_ClipType !== ClipperLib.ClipType.ctUnion) {
        edge.WindCnt = 1;
        edge.WindCnt2 = e.WindCnt2;
        e = e.NextInAEL;
    } else if (this.IsEvenOddFillType(edge)) {
        if (edge.WindDelta === 0) {
            var Inside = true;
            var e2 = e.PrevInAEL;
            while (e2 !== null) {
                if (e2.PolyTyp === e.PolyTyp && e2.WindDelta !== 0) 
                    { Inside = !Inside; }
                e2 = e2.PrevInAEL;
            }
            edge.WindCnt = Inside ? 0 : 1;
        } else {
            edge.WindCnt = edge.WindDelta;
        }
        edge.WindCnt2 = e.WindCnt2;
        e = e.NextInAEL;
    } else {
        if (e.WindCnt * e.WindDelta < 0) {
            if (Math.abs(e.WindCnt) > 1) {
                if (e.WindDelta * edge.WindDelta < 0) 
                    { edge.WindCnt = e.WindCnt; }
                 else 
                    { edge.WindCnt = e.WindCnt + edge.WindDelta; }
            } else 
                { edge.WindCnt = edge.WindDelta === 0 ? 1 : edge.WindDelta; }
        } else {
            if (edge.WindDelta === 0) 
                { edge.WindCnt = e.WindCnt < 0 ? e.WindCnt - 1 : e.WindCnt + 1; }
             else if (e.WindDelta * edge.WindDelta < 0) 
                { edge.WindCnt = e.WindCnt; }
             else 
                { edge.WindCnt = e.WindCnt + edge.WindDelta; }
        }
        edge.WindCnt2 = e.WindCnt2;
        e = e.NextInAEL;
    }
    if (this.IsEvenOddAltFillType(edge)) {
        while (e !== edge) {
            if (e.WindDelta !== 0) 
                { edge.WindCnt2 = edge.WindCnt2 === 0 ? 1 : 0; }
            e = e.NextInAEL;
        }
    } else {
        while (e !== edge) {
            edge.WindCnt2 += e.WindDelta;
            e = e.NextInAEL;
        }
    }
};
ClipperLib.Clipper.prototype.AddEdgeToSEL = function (edge) {
    if (this.m_SortedEdges === null) {
        this.m_SortedEdges = edge;
        edge.PrevInSEL = null;
        edge.NextInSEL = null;
    } else {
        edge.NextInSEL = this.m_SortedEdges;
        edge.PrevInSEL = null;
        this.m_SortedEdges.PrevInSEL = edge;
        this.m_SortedEdges = edge;
    }
};
ClipperLib.Clipper.prototype.PopEdgeFromSEL = function (e) {
    e.v = this.m_SortedEdges;
    if (e.v === null) {
        return false;
    }
    var oldE = e.v;
    this.m_SortedEdges = e.v.NextInSEL;
    if (this.m_SortedEdges !== null) {
        this.m_SortedEdges.PrevInSEL = null;
    }
    oldE.NextInSEL = null;
    oldE.PrevInSEL = null;
    return true;
};
ClipperLib.Clipper.prototype.CopyAELToSEL = function () {
    var e = this.m_ActiveEdges;
    this.m_SortedEdges = e;
    while (e !== null) {
        e.PrevInSEL = e.PrevInAEL;
        e.NextInSEL = e.NextInAEL;
        e = e.NextInAEL;
    }
};
ClipperLib.Clipper.prototype.SwapPositionsInSEL = function (edge1, edge2) {
    if (edge1.NextInSEL === null && edge1.PrevInSEL === null) 
        { return; }
    if (edge2.NextInSEL === null && edge2.PrevInSEL === null) 
        { return; }
    if (edge1.NextInSEL === edge2) {
        var next = edge2.NextInSEL;
        if (next !== null) 
            { next.PrevInSEL = edge1; }
        var prev = edge1.PrevInSEL;
        if (prev !== null) 
            { prev.NextInSEL = edge2; }
        edge2.PrevInSEL = prev;
        edge2.NextInSEL = edge1;
        edge1.PrevInSEL = edge2;
        edge1.NextInSEL = next;
    } else if (edge2.NextInSEL === edge1) {
        var next = edge1.NextInSEL;
        if (next !== null) 
            { next.PrevInSEL = edge2; }
        var prev = edge2.PrevInSEL;
        if (prev !== null) 
            { prev.NextInSEL = edge1; }
        edge1.PrevInSEL = prev;
        edge1.NextInSEL = edge2;
        edge2.PrevInSEL = edge1;
        edge2.NextInSEL = next;
    } else {
        var next = edge1.NextInSEL;
        var prev = edge1.PrevInSEL;
        edge1.NextInSEL = edge2.NextInSEL;
        if (edge1.NextInSEL !== null) 
            { edge1.NextInSEL.PrevInSEL = edge1; }
        edge1.PrevInSEL = edge2.PrevInSEL;
        if (edge1.PrevInSEL !== null) 
            { edge1.PrevInSEL.NextInSEL = edge1; }
        edge2.NextInSEL = next;
        if (edge2.NextInSEL !== null) 
            { edge2.NextInSEL.PrevInSEL = edge2; }
        edge2.PrevInSEL = prev;
        if (edge2.PrevInSEL !== null) 
            { edge2.PrevInSEL.NextInSEL = edge2; }
    }
    if (edge1.PrevInSEL === null) 
        { this.m_SortedEdges = edge1; }
     else if (edge2.PrevInSEL === null) 
        { this.m_SortedEdges = edge2; }
};
ClipperLib.Clipper.prototype.AddLocalMaxPoly = function (e1, e2, pt) {
    this.AddOutPt(e1, pt);
    if (e2.WindDelta === 0) 
        { this.AddOutPt(e2, pt); }
    if (e1.OutIdx === e2.OutIdx) {
        e1.OutIdx = -1;
        e2.OutIdx = -1;
    } else if (e1.OutIdx < e2.OutIdx) 
        { this.AppendPolygon(e1, e2); }
     else 
        { this.AppendPolygon(e2, e1); }
};
ClipperLib.Clipper.prototype.AddLocalMinPoly = function (e1, e2, pt) {
    var result;
    var e, prevE;
    if (ClipperLib.ClipperBase.IsHorizontal(e2) || e1.Dx > e2.Dx) {
        result = this.AddOutPt(e1, pt);
        e2.OutIdx = e1.OutIdx;
        e1.Side = ClipperLib.EdgeSide.esLeft;
        e2.Side = ClipperLib.EdgeSide.esRight;
        e = e1;
        if (e.PrevInAEL === e2) 
            { prevE = e2.PrevInAEL; }
         else 
            { prevE = e.PrevInAEL; }
    } else {
        result = this.AddOutPt(e2, pt);
        e1.OutIdx = e2.OutIdx;
        e1.Side = ClipperLib.EdgeSide.esRight;
        e2.Side = ClipperLib.EdgeSide.esLeft;
        e = e2;
        if (e.PrevInAEL === e1) 
            { prevE = e1.PrevInAEL; }
         else 
            { prevE = e.PrevInAEL; }
    }
    if (prevE !== null && prevE.OutIdx >= 0 && prevE.Top.Y < pt.Y && e.Top.Y < pt.Y) {
        var xPrev = ClipperLib.Clipper.TopX(prevE, pt.Y);
        var xE = ClipperLib.Clipper.TopX(e, pt.Y);
        if (xPrev === xE && e.WindDelta !== 0 && prevE.WindDelta !== 0 && ClipperLib.ClipperBase.SlopesEqual5(new ClipperLib.FPoint2(xPrev, pt.Y), prevE.Top, new ClipperLib.FPoint2(xE, pt.Y), e.Top)) {
            var outPt = this.AddOutPt(prevE, pt);
            this.AddJoin(result, outPt, e.Top);
        }
    }
    return result;
};
ClipperLib.Clipper.prototype.AddOutPt = function (e, pt) {
    if (e.OutIdx < 0) {
        var outRec = this.CreateOutRec();
        outRec.IsOpen = e.WindDelta === 0;
        var newOp = new ClipperLib.OutPt();
        outRec.Pts = newOp;
        newOp.Idx = outRec.Idx;
        newOp.Pt.X = pt.X;
        newOp.Pt.Y = pt.Y;
        if (ClipperLib.use_xyz) 
            { newOp.Pt.Z = pt.Z; }
        newOp.Next = newOp;
        newOp.Prev = newOp;
        if (!outRec.IsOpen) 
            { this.SetHoleState(e, outRec); }
        e.OutIdx = outRec.Idx;
        return newOp;
    } else {
        var outRec = this.m_PolyOuts[e.OutIdx];
        var op = outRec.Pts;
        var ToFront = e.Side === ClipperLib.EdgeSide.esLeft;
        if (ToFront && ClipperLib.FPoint.op_Equality(pt, op.Pt)) 
            { return op; }
         else if (!ToFront && ClipperLib.FPoint.op_Equality(pt, op.Prev.Pt)) 
            { return op.Prev; }
        var newOp = new ClipperLib.OutPt();
        newOp.Idx = outRec.Idx;
        newOp.Pt.X = pt.X;
        newOp.Pt.Y = pt.Y;
        if (ClipperLib.use_xyz) 
            { newOp.Pt.Z = pt.Z; }
        newOp.Next = op;
        newOp.Prev = op.Prev;
        newOp.Prev.Next = newOp;
        op.Prev = newOp;
        if (ToFront) 
            { outRec.Pts = newOp; }
        return newOp;
    }
};
ClipperLib.Clipper.prototype.GetLastOutPt = function (e) {
    var outRec = this.m_PolyOuts[e.OutIdx];
    if (e.Side === ClipperLib.EdgeSide.esLeft) {
        return outRec.Pts;
    } else {
        return outRec.Pts.Prev;
    }
};
ClipperLib.Clipper.prototype.SwapPoints = function (pt1, pt2) {
    var tmp = new ClipperLib.FPoint1(pt1.Value);
    pt1.Value.X = pt2.Value.X;
    pt1.Value.Y = pt2.Value.Y;
    if (ClipperLib.use_xyz) 
        { pt1.Value.Z = pt2.Value.Z; }
    pt2.Value.X = tmp.X;
    pt2.Value.Y = tmp.Y;
    if (ClipperLib.use_xyz) 
        { pt2.Value.Z = tmp.Z; }
};
ClipperLib.Clipper.prototype.HorzSegmentsOverlap = function (seg1a, seg1b, seg2a, seg2b) {
    var tmp;
    if (seg1a > seg1b) {
        tmp = seg1a;
        seg1a = seg1b;
        seg1b = tmp;
    }
    if (seg2a > seg2b) {
        tmp = seg2a;
        seg2a = seg2b;
        seg2b = tmp;
    }
    return seg1a < seg2b && seg2a < seg1b;
};
ClipperLib.Clipper.prototype.SetHoleState = function (e, outRec) {
    var e2 = e.PrevInAEL;
    var eTmp = null;
    while (e2 !== null) {
        if (e2.OutIdx >= 0 && e2.WindDelta !== 0) {
            if (eTmp === null) 
                { eTmp = e2; }
             else if (eTmp.OutIdx === e2.OutIdx) 
                { eTmp = null; }
        }
        e2 = e2.PrevInAEL;
    }
    if (eTmp === null) {
        outRec.FirstLeft = null;
        outRec.IsHole = false;
    } else {
        outRec.FirstLeft = this.m_PolyOuts[eTmp.OutIdx];
        outRec.IsHole = !outRec.FirstLeft.IsHole;
    }
};
ClipperLib.Clipper.prototype.GetDx = function (pt1, pt2) {
    if (pt1.Y === pt2.Y) 
        { return ClipperLib.ClipperBase.horizontal; }
     else 
        { return (pt2.X - pt1.X) / (pt2.Y - pt1.Y); }
};
ClipperLib.Clipper.prototype.FirstIsBottomPt = function (btmPt1, btmPt2) {
    var p = btmPt1.Prev;
    while (ClipperLib.FPoint.op_Equality(p.Pt, btmPt1.Pt) && p !== btmPt1) 
        { p = p.Prev; }
    var dx1p = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
    p = btmPt1.Next;
    while (ClipperLib.FPoint.op_Equality(p.Pt, btmPt1.Pt) && p !== btmPt1) 
        { p = p.Next; }
    var dx1n = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
    p = btmPt2.Prev;
    while (ClipperLib.FPoint.op_Equality(p.Pt, btmPt2.Pt) && p !== btmPt2) 
        { p = p.Prev; }
    var dx2p = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
    p = btmPt2.Next;
    while (ClipperLib.FPoint.op_Equality(p.Pt, btmPt2.Pt) && p !== btmPt2) 
        { p = p.Next; }
    var dx2n = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
    if (Math.max(dx1p, dx1n) === Math.max(dx2p, dx2n) && Math.min(dx1p, dx1n) === Math.min(dx2p, dx2n)) {
        return this.Area(btmPt1) > 0;
    } else {
        return dx1p >= dx2p && dx1p >= dx2n || dx1n >= dx2p && dx1n >= dx2n;
    }
};
ClipperLib.Clipper.prototype.GetBottomPt = function (pp) {
    var this$1 = this;

    var dups = null;
    var p = pp.Next;
    while (p !== pp) {
        if (p.Pt.Y > pp.Pt.Y) {
            pp = p;
            dups = null;
        } else if (p.Pt.Y === pp.Pt.Y && p.Pt.X <= pp.Pt.X) {
            if (p.Pt.X < pp.Pt.X) {
                dups = null;
                pp = p;
            } else {
                if (p.Next !== pp && p.Prev !== pp) 
                    { dups = p; }
            }
        }
        p = p.Next;
    }
    if (dups !== null) {
        while (dups !== p) {
            if (!this$1.FirstIsBottomPt(p, dups)) 
                { pp = dups; }
            dups = dups.Next;
            while (ClipperLib.FPoint.op_Inequality(dups.Pt, pp.Pt)) 
                { dups = dups.Next; }
        }
    }
    return pp;
};
ClipperLib.Clipper.prototype.GetLowermostRec = function (outRec1, outRec2) {
    if (outRec1.BottomPt === null) 
        { outRec1.BottomPt = this.GetBottomPt(outRec1.Pts); }
    if (outRec2.BottomPt === null) 
        { outRec2.BottomPt = this.GetBottomPt(outRec2.Pts); }
    var bPt1 = outRec1.BottomPt;
    var bPt2 = outRec2.BottomPt;
    if (bPt1.Pt.Y > bPt2.Pt.Y) 
        { return outRec1; }
     else if (bPt1.Pt.Y < bPt2.Pt.Y) 
        { return outRec2; }
     else if (bPt1.Pt.X < bPt2.Pt.X) 
        { return outRec1; }
     else if (bPt1.Pt.X > bPt2.Pt.X) 
        { return outRec2; }
     else if (bPt1.Next === bPt1) 
        { return outRec2; }
     else if (bPt2.Next === bPt2) 
        { return outRec1; }
     else if (this.FirstIsBottomPt(bPt1, bPt2)) 
        { return outRec1; }
     else 
        { return outRec2; }
};
ClipperLib.Clipper.prototype.OutRec1RightOfOutRec2 = function (outRec1, outRec2) {
    do {
        outRec1 = outRec1.FirstLeft;
        if (outRec1 === outRec2) 
            { return true; }
    } while (outRec1 !== null);
    return false;
};
ClipperLib.Clipper.prototype.GetOutRec = function (idx) {
    var this$1 = this;

    var outrec = this.m_PolyOuts[idx];
    while (outrec !== this.m_PolyOuts[outrec.Idx]) 
        { outrec = this$1.m_PolyOuts[outrec.Idx]; }
    return outrec;
};
ClipperLib.Clipper.prototype.AppendPolygon = function (e1, e2) {
    var outRec1 = this.m_PolyOuts[e1.OutIdx];
    var outRec2 = this.m_PolyOuts[e2.OutIdx];
    var holeStateRec;
    if (this.OutRec1RightOfOutRec2(outRec1, outRec2)) 
        { holeStateRec = outRec2; }
     else if (this.OutRec1RightOfOutRec2(outRec2, outRec1)) 
        { holeStateRec = outRec1; }
     else 
        { holeStateRec = this.GetLowermostRec(outRec1, outRec2); }
    var p1_lft = outRec1.Pts;
    var p1_rt = p1_lft.Prev;
    var p2_lft = outRec2.Pts;
    var p2_rt = p2_lft.Prev;
    if (e1.Side === ClipperLib.EdgeSide.esLeft) {
        if (e2.Side === ClipperLib.EdgeSide.esLeft) {
            this.ReversePolyPtLinks(p2_lft);
            p2_lft.Next = p1_lft;
            p1_lft.Prev = p2_lft;
            p1_rt.Next = p2_rt;
            p2_rt.Prev = p1_rt;
            outRec1.Pts = p2_rt;
        } else {
            p2_rt.Next = p1_lft;
            p1_lft.Prev = p2_rt;
            p2_lft.Prev = p1_rt;
            p1_rt.Next = p2_lft;
            outRec1.Pts = p2_lft;
        }
    } else {
        if (e2.Side === ClipperLib.EdgeSide.esRight) {
            this.ReversePolyPtLinks(p2_lft);
            p1_rt.Next = p2_rt;
            p2_rt.Prev = p1_rt;
            p2_lft.Next = p1_lft;
            p1_lft.Prev = p2_lft;
        } else {
            p1_rt.Next = p2_lft;
            p2_lft.Prev = p1_rt;
            p1_lft.Prev = p2_rt;
            p2_rt.Next = p1_lft;
        }
    }
    outRec1.BottomPt = null;
    if (holeStateRec === outRec2) {
        if (outRec2.FirstLeft !== outRec1) 
            { outRec1.FirstLeft = outRec2.FirstLeft; }
        outRec1.IsHole = outRec2.IsHole;
    }
    outRec2.Pts = null;
    outRec2.BottomPt = null;
    outRec2.FirstLeft = outRec1;
    var OKIdx = e1.OutIdx;
    var ObsoleteIdx = e2.OutIdx;
    e1.OutIdx = -1;
    e2.OutIdx = -1;
    var e = this.m_ActiveEdges;
    while (e !== null) {
        if (e.OutIdx === ObsoleteIdx) {
            e.OutIdx = OKIdx;
            e.Side = e1.Side;
            break;
        }
        e = e.NextInAEL;
    }
    outRec2.Idx = outRec1.Idx;
};
ClipperLib.Clipper.prototype.ReversePolyPtLinks = function (pp) {
    if (pp === null) 
        { return; }
    var pp1;
    var pp2;
    pp1 = pp;
    do {
        pp2 = pp1.Next;
        pp1.Next = pp1.Prev;
        pp1.Prev = pp2;
        pp1 = pp2;
    } while (pp1 !== pp);
};
ClipperLib.Clipper.SwapSides = function (edge1, edge2) {
    var side = edge1.Side;
    edge1.Side = edge2.Side;
    edge2.Side = side;
};
ClipperLib.Clipper.SwapPolyIndexes = function (edge1, edge2) {
    var outIdx = edge1.OutIdx;
    edge1.OutIdx = edge2.OutIdx;
    edge2.OutIdx = outIdx;
};
ClipperLib.Clipper.prototype.IntersectEdges = function (e1, e2, pt) {
    var e1Contributing = e1.OutIdx >= 0;
    var e2Contributing = e2.OutIdx >= 0;
    if (ClipperLib.use_xyz) 
        { this.SetZ(pt, e1, e2); }
    if (ClipperLib.use_lines) {
        if (e1.WindDelta === 0 || e2.WindDelta === 0) {
            if (e1.WindDelta === 0 && e2.WindDelta === 0) 
                { return; }
             else if (e1.PolyTyp === e2.PolyTyp && e1.WindDelta !== e2.WindDelta && this.m_ClipType === ClipperLib.ClipType.ctUnion) {
                if (e1.WindDelta === 0) {
                    if (e2Contributing) {
                        this.AddOutPt(e1, pt);
                        if (e1Contributing) 
                            { e1.OutIdx = -1; }
                    }
                } else {
                    if (e1Contributing) {
                        this.AddOutPt(e2, pt);
                        if (e2Contributing) 
                            { e2.OutIdx = -1; }
                    }
                }
            } else if (e1.PolyTyp !== e2.PolyTyp) {
                if (e1.WindDelta === 0 && Math.abs(e2.WindCnt) === 1 && (this.m_ClipType !== ClipperLib.ClipType.ctUnion || e2.WindCnt2 === 0)) {
                    this.AddOutPt(e1, pt);
                    if (e1Contributing) 
                        { e1.OutIdx = -1; }
                } else if (e2.WindDelta === 0 && Math.abs(e1.WindCnt) === 1 && (this.m_ClipType !== ClipperLib.ClipType.ctUnion || e1.WindCnt2 === 0)) {
                    this.AddOutPt(e2, pt);
                    if (e2Contributing) 
                        { e2.OutIdx = -1; }
                }
            }
            return;
        }
    }
    if (e1.PolyTyp === e2.PolyTyp) {
        if (this.IsEvenOddFillType(e1)) {
            var oldE1WindCnt = e1.WindCnt;
            e1.WindCnt = e2.WindCnt;
            e2.WindCnt = oldE1WindCnt;
        } else {
            if (e1.WindCnt + e2.WindDelta === 0) 
                { e1.WindCnt = -e1.WindCnt; }
             else 
                { e1.WindCnt += e2.WindDelta; }
            if (e2.WindCnt - e1.WindDelta === 0) 
                { e2.WindCnt = -e2.WindCnt; }
             else 
                { e2.WindCnt -= e1.WindDelta; }
        }
    } else {
        if (!this.IsEvenOddFillType(e2)) 
            { e1.WindCnt2 += e2.WindDelta; }
         else 
            { e1.WindCnt2 = e1.WindCnt2 === 0 ? 1 : 0; }
        if (!this.IsEvenOddFillType(e1)) 
            { e2.WindCnt2 -= e1.WindDelta; }
         else 
            { e2.WindCnt2 = e2.WindCnt2 === 0 ? 1 : 0; }
    }
    var e1FillType, e2FillType, e1FillType2, e2FillType2;
    if (e1.PolyTyp === ClipperLib.PolyType.ptSubject) {
        e1FillType = this.m_SubjFillType;
        e1FillType2 = this.m_ClipFillType;
    } else {
        e1FillType = this.m_ClipFillType;
        e1FillType2 = this.m_SubjFillType;
    }
    if (e2.PolyTyp === ClipperLib.PolyType.ptSubject) {
        e2FillType = this.m_SubjFillType;
        e2FillType2 = this.m_ClipFillType;
    } else {
        e2FillType = this.m_ClipFillType;
        e2FillType2 = this.m_SubjFillType;
    }
    var e1Wc, e2Wc;
    switch (e1FillType) {
        case ClipperLib.PolyFillType.pftPositive:
            e1Wc = e1.WindCnt;
            break;
        case ClipperLib.PolyFillType.pftNegative:
            e1Wc = -e1.WindCnt;
            break;
        default:
            e1Wc = Math.abs(e1.WindCnt);
            break;
    }
    switch (e2FillType) {
        case ClipperLib.PolyFillType.pftPositive:
            e2Wc = e2.WindCnt;
            break;
        case ClipperLib.PolyFillType.pftNegative:
            e2Wc = -e2.WindCnt;
            break;
        default:
            e2Wc = Math.abs(e2.WindCnt);
            break;
    }
    if (e1Contributing && e2Contributing) {
        if (e1Wc !== 0 && e1Wc !== 1 || e2Wc !== 0 && e2Wc !== 1 || e1.PolyTyp !== e2.PolyTyp && this.m_ClipType !== ClipperLib.ClipType.ctXor) {
            this.AddLocalMaxPoly(e1, e2, pt);
        } else {
            this.AddOutPt(e1, pt);
            this.AddOutPt(e2, pt);
            ClipperLib.Clipper.SwapSides(e1, e2);
            ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
        }
    } else if (e1Contributing) {
        if (e2Wc === 0 || e2Wc === 1) {
            this.AddOutPt(e1, pt);
            ClipperLib.Clipper.SwapSides(e1, e2);
            ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
        }
    } else if (e2Contributing) {
        if (e1Wc === 0 || e1Wc === 1) {
            this.AddOutPt(e2, pt);
            ClipperLib.Clipper.SwapSides(e1, e2);
            ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
        }
    } else if ((e1Wc === 0 || e1Wc === 1) && (e2Wc === 0 || e2Wc === 1)) {
        var e1Wc2, e2Wc2;
        switch (e1FillType2) {
            case ClipperLib.PolyFillType.pftPositive:
                e1Wc2 = e1.WindCnt2;
                break;
            case ClipperLib.PolyFillType.pftNegative:
                e1Wc2 = -e1.WindCnt2;
                break;
            default:
                e1Wc2 = Math.abs(e1.WindCnt2);
                break;
        }
        switch (e2FillType2) {
            case ClipperLib.PolyFillType.pftPositive:
                e2Wc2 = e2.WindCnt2;
                break;
            case ClipperLib.PolyFillType.pftNegative:
                e2Wc2 = -e2.WindCnt2;
                break;
            default:
                e2Wc2 = Math.abs(e2.WindCnt2);
                break;
        }
        if (e1.PolyTyp !== e2.PolyTyp) {
            this.AddLocalMinPoly(e1, e2, pt);
        } else if (e1Wc === 1 && e2Wc === 1) 
            { switch (this.m_ClipType) {
            case ClipperLib.ClipType.ctIntersection:
                if (e1Wc2 > 0 && e2Wc2 > 0) 
                    { this.AddLocalMinPoly(e1, e2, pt); }
                break;
            case ClipperLib.ClipType.ctUnion:
                if (e1Wc2 <= 0 && e2Wc2 <= 0) 
                    { this.AddLocalMinPoly(e1, e2, pt); }
                break;
            case ClipperLib.ClipType.ctDifference:
                if (e1.PolyTyp === ClipperLib.PolyType.ptClip && e1Wc2 > 0 && e2Wc2 > 0 || e1.PolyTyp === ClipperLib.PolyType.ptSubject && e1Wc2 <= 0 && e2Wc2 <= 0) 
                    { this.AddLocalMinPoly(e1, e2, pt); }
                break;
            case ClipperLib.ClipType.ctXor:
                this.AddLocalMinPoly(e1, e2, pt);
                break;
        } }
         else 
            { ClipperLib.Clipper.SwapSides(e1, e2); }
    }
};
ClipperLib.Clipper.prototype.DeleteFromSEL = function (e) {
    var SelPrev = e.PrevInSEL;
    var SelNext = e.NextInSEL;
    if (SelPrev === null && SelNext === null && e !== this.m_SortedEdges) 
        { return; }
    if (SelPrev !== null) 
        { SelPrev.NextInSEL = SelNext; }
     else 
        { this.m_SortedEdges = SelNext; }
    if (SelNext !== null) 
        { SelNext.PrevInSEL = SelPrev; }
    e.NextInSEL = null;
    e.PrevInSEL = null;
};
ClipperLib.Clipper.prototype.ProcessHorizontals = function () {
    var this$1 = this;

    var horzEdge = {};
    while (this.PopEdgeFromSEL(horzEdge)) {
        this$1.ProcessHorizontal(horzEdge.v);
    }
};
ClipperLib.Clipper.prototype.GetHorzDirection = function (HorzEdge, $var) {
    if (HorzEdge.Bot.X < HorzEdge.Top.X) {
        $var.Left = HorzEdge.Bot.X;
        $var.Right = HorzEdge.Top.X;
        $var.Dir = ClipperLib.Direction.dLeftToRight;
    } else {
        $var.Left = HorzEdge.Top.X;
        $var.Right = HorzEdge.Bot.X;
        $var.Dir = ClipperLib.Direction.dRightToLeft;
    }
};
ClipperLib.Clipper.prototype.ProcessHorizontal = function (horzEdge) {
    var this$1 = this;

    var $var = {
        Dir: null,
        Left: null,
        Right: null
    };
    this.GetHorzDirection(horzEdge, $var);
    var dir = $var.Dir;
    var horzLeft = $var.Left;
    var horzRight = $var.Right;
    var IsOpen = horzEdge.WindDelta === 0;
    var eLastHorz = horzEdge, eMaxPair = null;
    while (eLastHorz.NextInLML !== null && ClipperLib.ClipperBase.IsHorizontal(eLastHorz.NextInLML)) 
        { eLastHorz = eLastHorz.NextInLML; }
    if (eLastHorz.NextInLML === null) 
        { eMaxPair = this.GetMaximaPair(eLastHorz); }
    var currMax = this.m_Maxima;
    if (currMax !== null) {
        if (dir === ClipperLib.Direction.dLeftToRight) {
            while (currMax !== null && currMax.X <= horzEdge.Bot.X) {
                currMax = currMax.Next;
            }
            if (currMax !== null && currMax.X >= eLastHorz.Top.X) {
                currMax = null;
            }
        } else {
            while (currMax.Next !== null && currMax.Next.X < horzEdge.Bot.X) {
                currMax = currMax.Next;
            }
            if (currMax.X <= eLastHorz.Top.X) {
                currMax = null;
            }
        }
    }
    var op1 = null;
    for (; ; ) {
        var IsLastHorz = horzEdge === eLastHorz;
        var e = this$1.GetNextInAEL(horzEdge, dir);
        while (e !== null) {
            if (currMax !== null) {
                if (dir === ClipperLib.Direction.dLeftToRight) {
                    while (currMax !== null && currMax.X < e.Curr.X) {
                        if (horzEdge.OutIdx >= 0 && !IsOpen) {
                            this$1.AddOutPt(horzEdge, new ClipperLib.FPoint2(currMax.X, horzEdge.Bot.Y));
                        }
                        currMax = currMax.Next;
                    }
                } else {
                    while (currMax !== null && currMax.X > e.Curr.X) {
                        if (horzEdge.OutIdx >= 0 && !IsOpen) {
                            this$1.AddOutPt(horzEdge, new ClipperLib.FPoint2(currMax.X, horzEdge.Bot.Y));
                        }
                        currMax = currMax.Prev;
                    }
                }
            }
            if (dir === ClipperLib.Direction.dLeftToRight && e.Curr.X > horzRight || dir === ClipperLib.Direction.dRightToLeft && e.Curr.X < horzLeft) {
                break;
            }
            if (e.Curr.X === horzEdge.Top.X && horzEdge.NextInLML !== null && e.Dx < horzEdge.NextInLML.Dx) 
                { break; }
            if (horzEdge.OutIdx >= 0 && !IsOpen) {
                if (ClipperLib.use_xyz) {
                    if (dir === ClipperLib.Direction.dLeftToRight) 
                        { this$1.SetZ(e.Curr, horzEdge, e); }
                     else 
                        { this$1.SetZ(e.Curr, e, horzEdge); }
                }
                op1 = this$1.AddOutPt(horzEdge, e.Curr);
                var eNextHorz = this$1.m_SortedEdges;
                while (eNextHorz !== null) {
                    if (eNextHorz.OutIdx >= 0 && this$1.HorzSegmentsOverlap(horzEdge.Bot.X, horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X)) {
                        var op2 = this$1.GetLastOutPt(eNextHorz);
                        this$1.AddJoin(op2, op1, eNextHorz.Top);
                    }
                    eNextHorz = eNextHorz.NextInSEL;
                }
                this$1.AddGhostJoin(op1, horzEdge.Bot);
            }
            if (e === eMaxPair && IsLastHorz) {
                if (horzEdge.OutIdx >= 0) {
                    this$1.AddLocalMaxPoly(horzEdge, eMaxPair, horzEdge.Top);
                }
                this$1.DeleteFromAEL(horzEdge);
                this$1.DeleteFromAEL(eMaxPair);
                return;
            }
            if (dir === ClipperLib.Direction.dLeftToRight) {
                var Pt = new ClipperLib.FPoint2(e.Curr.X, horzEdge.Curr.Y);
                this$1.IntersectEdges(horzEdge, e, Pt);
            } else {
                var Pt = new ClipperLib.FPoint2(e.Curr.X, horzEdge.Curr.Y);
                this$1.IntersectEdges(e, horzEdge, Pt);
            }
            var eNext = this$1.GetNextInAEL(e, dir);
            this$1.SwapPositionsInAEL(horzEdge, e);
            e = eNext;
        }
        if (horzEdge.NextInLML === null || !ClipperLib.ClipperBase.IsHorizontal(horzEdge.NextInLML)) {
            break;
        }
        horzEdge = this$1.UpdateEdgeIntoAEL(horzEdge);
        if (horzEdge.OutIdx >= 0) {
            this$1.AddOutPt(horzEdge, horzEdge.Bot);
        }
        $var = {
            Dir: dir,
            Left: horzLeft,
            Right: horzRight
        };
        this$1.GetHorzDirection(horzEdge, $var);
        dir = $var.Dir;
        horzLeft = $var.Left;
        horzRight = $var.Right;
    }
    if (horzEdge.OutIdx >= 0 && op1 === null) {
        op1 = this.GetLastOutPt(horzEdge);
        var eNextHorz = this.m_SortedEdges;
        while (eNextHorz !== null) {
            if (eNextHorz.OutIdx >= 0 && this$1.HorzSegmentsOverlap(horzEdge.Bot.X, horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X)) {
                var op2 = this$1.GetLastOutPt(eNextHorz);
                this$1.AddJoin(op2, op1, eNextHorz.Top);
            }
            eNextHorz = eNextHorz.NextInSEL;
        }
        this.AddGhostJoin(op1, horzEdge.Top);
    }
    if (horzEdge.NextInLML !== null) {
        if (horzEdge.OutIdx >= 0) {
            op1 = this.AddOutPt(horzEdge, horzEdge.Top);
            horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
            if (horzEdge.WindDelta === 0) {
                return;
            }
            var ePrev = horzEdge.PrevInAEL;
            var eNext = horzEdge.NextInAEL;
            if (ePrev !== null && ePrev.Curr.X === horzEdge.Bot.X && ePrev.Curr.Y === horzEdge.Bot.Y && ePrev.WindDelta === 0 && (ePrev.OutIdx >= 0 && ePrev.Curr.Y > ePrev.Top.Y && ClipperLib.ClipperBase.SlopesEqual3(horzEdge, ePrev))) {
                var op2 = this.AddOutPt(ePrev, horzEdge.Bot);
                this.AddJoin(op1, op2, horzEdge.Top);
            } else if (eNext !== null && eNext.Curr.X === horzEdge.Bot.X && eNext.Curr.Y === horzEdge.Bot.Y && eNext.WindDelta !== 0 && eNext.OutIdx >= 0 && eNext.Curr.Y > eNext.Top.Y && ClipperLib.ClipperBase.SlopesEqual3(horzEdge, eNext)) {
                var op2 = this.AddOutPt(eNext, horzEdge.Bot);
                this.AddJoin(op1, op2, horzEdge.Top);
            }
        } else {
            horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
        }
    } else {
        if (horzEdge.OutIdx >= 0) {
            this.AddOutPt(horzEdge, horzEdge.Top);
        }
        this.DeleteFromAEL(horzEdge);
    }
};
ClipperLib.Clipper.prototype.GetNextInAEL = function (e, Direction) {
    return Direction === ClipperLib.Direction.dLeftToRight ? e.NextInAEL : e.PrevInAEL;
};
ClipperLib.Clipper.prototype.IsMinima = function (e) {
    return e !== null && e.Prev.NextInLML !== e && e.Next.NextInLML !== e;
};
ClipperLib.Clipper.prototype.IsMaxima = function (e, Y) {
    return e !== null && e.Top.Y === Y && e.NextInLML === null;
};
ClipperLib.Clipper.prototype.IsIntermediate = function (e, Y) {
    return e.Top.Y === Y && e.NextInLML !== null;
};
ClipperLib.Clipper.prototype.GetMaximaPair = function (e) {
    if (ClipperLib.FPoint.op_Equality(e.Next.Top, e.Top) && e.Next.NextInLML === null) {
        return e.Next;
    } else {
        if (ClipperLib.FPoint.op_Equality(e.Prev.Top, e.Top) && e.Prev.NextInLML === null) {
            return e.Prev;
        } else {
            return null;
        }
    }
};
ClipperLib.Clipper.prototype.GetMaximaPairEx = function (e) {
    var result = this.GetMaximaPair(e);
    if (result === null || result.OutIdx === ClipperLib.ClipperBase.Skip || result.NextInAEL === result.PrevInAEL && !ClipperLib.ClipperBase.IsHorizontal(result)) {
        return null;
    }
    return result;
};
ClipperLib.Clipper.prototype.ProcessIntersections = function (topY) {
    if (this.m_ActiveEdges === null) 
        { return true; }
    try {
        this.BuildIntersectList(topY);
        if (this.m_IntersectList.length === 0) 
            { return true; }
        if (this.m_IntersectList.length === 1 || this.FixupIntersectionOrder()) 
            { this.ProcessIntersectList(); }
         else 
            { return false; }
    } catch ($$e2) {
        this.m_SortedEdges = null;
        this.m_IntersectList.length = 0;
        ClipperLib.Error("ProcessIntersections error");
    }
    this.m_SortedEdges = null;
    return true;
};
ClipperLib.Clipper.prototype.BuildIntersectList = function (topY) {
    var this$1 = this;

    if (this.m_ActiveEdges === null) 
        { return; }
    var e = this.m_ActiveEdges;
    this.m_SortedEdges = e;
    while (e !== null) {
        e.PrevInSEL = e.PrevInAEL;
        e.NextInSEL = e.NextInAEL;
        e.Curr.X = ClipperLib.Clipper.TopX(e, topY);
        e = e.NextInAEL;
    }
    var isModified = true;
    while (isModified && this.m_SortedEdges !== null) {
        isModified = false;
        e = this$1.m_SortedEdges;
        while (e.NextInSEL !== null) {
            var eNext = e.NextInSEL;
            var pt = new ClipperLib.FPoint0();
            if (e.Curr.X > eNext.Curr.X) {
                this$1.IntersectPoint(e, eNext, pt);
                if (pt.Y < topY) {
                    pt = new ClipperLib.FPoint2(ClipperLib.Clipper.TopX(e, topY), topY);
                }
                var newNode = new ClipperLib.IntersectNode();
                newNode.Edge1 = e;
                newNode.Edge2 = eNext;
                newNode.Pt.X = pt.X;
                newNode.Pt.Y = pt.Y;
                if (ClipperLib.use_xyz) 
                    { newNode.Pt.Z = pt.Z; }
                this$1.m_IntersectList.push(newNode);
                this$1.SwapPositionsInSEL(e, eNext);
                isModified = true;
            } else 
                { e = eNext; }
        }
        if (e.PrevInSEL !== null) 
            { e.PrevInSEL.NextInSEL = null; }
         else 
            { break; }
    }
    this.m_SortedEdges = null;
};
ClipperLib.Clipper.prototype.EdgesAdjacent = function (inode) {
    return inode.Edge1.NextInSEL === inode.Edge2 || inode.Edge1.PrevInSEL === inode.Edge2;
};
ClipperLib.Clipper.IntersectNodeSort = function (node1, node2) {
    return node2.Pt.Y - node1.Pt.Y;
};
ClipperLib.Clipper.prototype.FixupIntersectionOrder = function () {
    var this$1 = this;

    this.m_IntersectList.sort(this.m_IntersectNodeComparer);
    this.CopyAELToSEL();
    var cnt = this.m_IntersectList.length;
    for (var i = 0;i < cnt; i++) {
        if (!this$1.EdgesAdjacent(this$1.m_IntersectList[i])) {
            var j = i + 1;
            while (j < cnt && !this.EdgesAdjacent(this.m_IntersectList[j])) 
                { j++; }
            if (j === cnt) 
                { return false; }
            var tmp = this$1.m_IntersectList[i];
            this$1.m_IntersectList[i] = this$1.m_IntersectList[j];
            this$1.m_IntersectList[j] = tmp;
        }
        this$1.SwapPositionsInSEL(this$1.m_IntersectList[i].Edge1, this$1.m_IntersectList[i].Edge2);
    }
    return true;
};
ClipperLib.Clipper.prototype.ProcessIntersectList = function () {
    var this$1 = this;

    for (var i = 0, ilen = this.m_IntersectList.length;i < ilen; i++) {
        var iNode = this$1.m_IntersectList[i];
        this$1.IntersectEdges(iNode.Edge1, iNode.Edge2, iNode.Pt);
        this$1.SwapPositionsInAEL(iNode.Edge1, iNode.Edge2);
    }
    this.m_IntersectList.length = 0;
};
ClipperLib.Clipper.TopX = function (edge, currentY) {
    if (currentY === edge.Top.Y) 
        { return edge.Top.X; }
    return edge.Bot.X + edge.Dx * (currentY - edge.Bot.Y);
};
ClipperLib.Clipper.prototype.IntersectPoint = function (edge1, edge2, ip) {
    ip.X = 0;
    ip.Y = 0;
    var b1, b2;
    if (edge1.Dx === edge2.Dx) {
        ip.Y = edge1.Curr.Y;
        ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
        return;
    }
    if (edge1.Delta.X === 0) {
        ip.X = edge1.Bot.X;
        if (ClipperLib.ClipperBase.IsHorizontal(edge2)) {
            ip.Y = edge2.Bot.Y;
        } else {
            b2 = edge2.Bot.Y - edge2.Bot.X / edge2.Dx;
            ip.Y = ip.X / edge2.Dx + b2;
        }
    } else if (edge2.Delta.X === 0) {
        ip.X = edge2.Bot.X;
        if (ClipperLib.ClipperBase.IsHorizontal(edge1)) {
            ip.Y = edge1.Bot.Y;
        } else {
            b1 = edge1.Bot.Y - edge1.Bot.X / edge1.Dx;
            ip.Y = ip.X / edge1.Dx + b1;
        }
    } else {
        b1 = edge1.Bot.X - edge1.Bot.Y * edge1.Dx;
        b2 = edge2.Bot.X - edge2.Bot.Y * edge2.Dx;
        var q = (b2 - b1) / (edge1.Dx - edge2.Dx);
        ip.Y = q;
        if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx)) 
            { ip.X = edge1.Dx * q + b1; }
         else 
            { ip.X = edge2.Dx * q + b2; }
    }
    if (ip.Y < edge1.Top.Y || ip.Y < edge2.Top.Y) {
        if (edge1.Top.Y > edge2.Top.Y) {
            ip.Y = edge1.Top.Y;
            ip.X = ClipperLib.Clipper.TopX(edge2, edge1.Top.Y);
            return ip.X < edge1.Top.X;
        } else 
            { ip.Y = edge2.Top.Y; }
        if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx)) 
            { ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y); }
         else 
            { ip.X = ClipperLib.Clipper.TopX(edge2, ip.Y); }
    }
    if (ip.Y > edge1.Curr.Y) {
        ip.Y = edge1.Curr.Y;
        if (Math.abs(edge1.Dx) > Math.abs(edge2.Dx)) 
            { ip.X = ClipperLib.Clipper.TopX(edge2, ip.Y); }
         else 
            { ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y); }
    }
};
ClipperLib.Clipper.prototype.ProcessEdgesAtTopOfScanbeam = function (topY) {
    var this$1 = this;

    var e = this.m_ActiveEdges;
    while (e !== null) {
        var IsMaximaEdge = this$1.IsMaxima(e, topY);
        if (IsMaximaEdge) {
            var eMaxPair = this$1.GetMaximaPairEx(e);
            IsMaximaEdge = eMaxPair === null || !ClipperLib.ClipperBase.IsHorizontal(eMaxPair);
        }
        if (IsMaximaEdge) {
            if (this$1.StrictlySimple) {
                this$1.InsertMaxima(e.Top.X);
            }
            var ePrev = e.PrevInAEL;
            this$1.DoMaxima(e);
            if (ePrev === null) 
                { e = this$1.m_ActiveEdges; }
             else 
                { e = ePrev.NextInAEL; }
        } else {
            if (this$1.IsIntermediate(e, topY) && ClipperLib.ClipperBase.IsHorizontal(e.NextInLML)) {
                e = this$1.UpdateEdgeIntoAEL(e);
                if (e.OutIdx >= 0) 
                    { this$1.AddOutPt(e, e.Bot); }
                this$1.AddEdgeToSEL(e);
            } else {
                e.Curr.X = ClipperLib.Clipper.TopX(e, topY);
                e.Curr.Y = topY;
            }
            if (ClipperLib.use_xyz) {
                if (e.Top.Y === topY) 
                    { e.Curr.Z = e.Top.Z; }
                 else if (e.Bot.Y === topY) 
                    { e.Curr.Z = e.Bot.Z; }
                 else 
                    { e.Curr.Z = 0; }
            }
            if (this$1.StrictlySimple) {
                var ePrev = e.PrevInAEL;
                if (e.OutIdx >= 0 && e.WindDelta !== 0 && ePrev !== null && ePrev.OutIdx >= 0 && ePrev.Curr.X === e.Curr.X && ePrev.WindDelta !== 0) {
                    var ip = new ClipperLib.FPoint1(e.Curr);
                    if (ClipperLib.use_xyz) {
                        this$1.SetZ(ip, ePrev, e);
                    }
                    var op = this$1.AddOutPt(ePrev, ip);
                    var op2 = this$1.AddOutPt(e, ip);
                    this$1.AddJoin(op, op2, ip);
                }
            }
            e = e.NextInAEL;
        }
    }
    this.ProcessHorizontals();
    this.m_Maxima = null;
    e = this.m_ActiveEdges;
    while (e !== null) {
        if (this$1.IsIntermediate(e, topY)) {
            var op = null;
            if (e.OutIdx >= 0) 
                { op = this$1.AddOutPt(e, e.Top); }
            e = this$1.UpdateEdgeIntoAEL(e);
            var ePrev = e.PrevInAEL;
            var eNext = e.NextInAEL;
            if (ePrev !== null && ePrev.Curr.X === e.Bot.X && ePrev.Curr.Y === e.Bot.Y && op !== null && ePrev.OutIdx >= 0 && ePrev.Curr.Y === ePrev.Top.Y && ClipperLib.ClipperBase.SlopesEqual5(e.Curr, e.Top, ePrev.Curr, ePrev.Top) && e.WindDelta !== 0 && ePrev.WindDelta !== 0) {
                var op2 = this$1.AddOutPt(ePrev2, e.Bot);
                this$1.AddJoin(op, op2, e.Top);
            } else if (eNext !== null && eNext.Curr.X === e.Bot.X && eNext.Curr.Y === e.Bot.Y && op !== null && eNext.OutIdx >= 0 && eNext.Curr.Y === eNext.Top.Y && ClipperLib.ClipperBase.SlopesEqual5(e.Curr, e.Top, eNext.Curr, eNext.Top) && e.WindDelta !== 0 && eNext.WindDelta !== 0) {
                var op2 = this$1.AddOutPt(eNext, e.Bot);
                this$1.AddJoin(op, op2, e.Top);
            }
        }
        e = e.NextInAEL;
    }
};
ClipperLib.Clipper.prototype.DoMaxima = function (e) {
    var this$1 = this;

    var eMaxPair = this.GetMaximaPairEx(e);
    if (eMaxPair === null) {
        if (e.OutIdx >= 0) 
            { this.AddOutPt(e, e.Top); }
        this.DeleteFromAEL(e);
        return;
    }
    var eNext = e.NextInAEL;
    while (eNext !== null && eNext !== eMaxPair) {
        this$1.IntersectEdges(e, eNext, e.Top);
        this$1.SwapPositionsInAEL(e, eNext);
        eNext = e.NextInAEL;
    }
    if (e.OutIdx === -1 && eMaxPair.OutIdx === -1) {
        this.DeleteFromAEL(e);
        this.DeleteFromAEL(eMaxPair);
    } else if (e.OutIdx >= 0 && eMaxPair.OutIdx >= 0) {
        if (e.OutIdx >= 0) 
            { this.AddLocalMaxPoly(e, eMaxPair, e.Top); }
        this.DeleteFromAEL(e);
        this.DeleteFromAEL(eMaxPair);
    } else if (ClipperLib.use_lines && e.WindDelta === 0) {
        if (e.OutIdx >= 0) {
            this.AddOutPt(e, e.Top);
            e.OutIdx = ClipperLib.ClipperBase.Unassigned;
        }
        this.DeleteFromAEL(e);
        if (eMaxPair.OutIdx >= 0) {
            this.AddOutPt(eMaxPair, e.Top);
            eMaxPair.OutIdx = ClipperLib.ClipperBase.Unassigned;
        }
        this.DeleteFromAEL(eMaxPair);
    } else 
        { ClipperLib.Error("DoMaxima error"); }
};
ClipperLib.Clipper.ReversePaths = function (polys) {
    for (var i = 0, len = polys.length;i < len; i++) 
        { polys[i].reverse(); }
};
ClipperLib.Clipper.Orientation = function (poly) {
    return ClipperLib.Clipper.Area(poly) >= 0;
};
ClipperLib.Clipper.prototype.PointCount = function (pts) {
    if (pts === null) 
        { return 0; }
    var result = 0;
    var p = pts;
    do {
        result++;
        p = p.Next;
    } while (p !== pts);
    return result;
};
ClipperLib.Clipper.prototype.BuildResult = function (polyg) {
    var this$1 = this;

    ClipperLib.Clear(polyg);
    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; i++) {
        var outRec = this$1.m_PolyOuts[i];
        if (outRec.Pts === null) 
            { continue; }
        var p = outRec.Pts.Prev;
        var cnt = this$1.PointCount(p);
        if (cnt < 2) 
            { continue; }
        var pg = new Array(cnt);
        for (var j = 0;j < cnt; j++) {
            pg[j] = p.Pt;
            p = p.Prev;
        }
        polyg.push(pg);
    }
};
ClipperLib.Clipper.prototype.BuildResult2 = function (polytree) {
    var this$1 = this;

    polytree.Clear();
    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; i++) {
        var outRec = this$1.m_PolyOuts[i];
        var cnt = this$1.PointCount(outRec.Pts);
        if (outRec.IsOpen && cnt < 2 || !outRec.IsOpen && cnt < 3) 
            { continue; }
        this$1.FixHoleLinkage(outRec);
        var pn = new ClipperLib.PolyNode();
        polytree.m_AllPolys.push(pn);
        outRec.PolyNode = pn;
        pn.m_polygon.length = cnt;
        var op = outRec.Pts.Prev;
        for (var j = 0;j < cnt; j++) {
            pn.m_polygon[j] = op.Pt;
            op = op.Prev;
        }
    }
    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; i++) {
        var outRec = this$1.m_PolyOuts[i];
        if (outRec.PolyNode === null) 
            { continue; }
         else if (outRec.IsOpen) {
            outRec.PolyNode.IsOpen = true;
            polytree.AddChild(outRec.PolyNode);
        } else if (outRec.FirstLeft !== null && outRec.FirstLeft.PolyNode !== null) 
            { outRec.FirstLeft.PolyNode.AddChild(outRec.PolyNode); }
         else 
            { polytree.AddChild(outRec.PolyNode); }
    }
};
ClipperLib.Clipper.prototype.FixupOutPolyline = function (outRec) {
    var pp = outRec.Pts;
    var lastPP = pp.Prev;
    while (pp !== lastPP) {
        pp = pp.Next;
        if (ClipperLib.FPoint.op_Equality(pp.Pt, pp.Prev.Pt)) {
            if (pp === lastPP) {
                lastPP = pp.Prev;
            }
            var tmpPP = pp.Prev;
            tmpPP.Next = pp.Next;
            pp.Next.Prev = tmpPP;
            pp = tmpPP;
        }
    }
    if (pp === pp.Prev) {
        outRec.Pts = null;
    }
};
ClipperLib.Clipper.prototype.FixupOutPolygon = function (outRec) {
    var this$1 = this;

    var lastOK = null;
    outRec.BottomPt = null;
    var pp = outRec.Pts;
    var preserveCol = this.PreserveCollinear || this.StrictlySimple;
    for (; ; ) {
        if (pp.Prev === pp || pp.Prev === pp.Next) {
            outRec.Pts = null;
            return;
        }
        if (ClipperLib.FPoint.op_Equality(pp.Pt, pp.Next.Pt) || ClipperLib.FPoint.op_Equality(pp.Pt, pp.Prev.Pt) || ClipperLib.ClipperBase.SlopesEqual4(pp.Prev.Pt, pp.Pt, pp.Next.Pt) && (!preserveCol || !this$1.Pt2IsBetweenPt1AndPt3(pp.Prev.Pt, pp.Pt, pp.Next.Pt))) {
            lastOK = null;
            pp.Prev.Next = pp.Next;
            pp.Next.Prev = pp.Prev;
            pp = pp.Prev;
        } else if (pp === lastOK) 
            { break; }
         else {
            if (lastOK === null) 
                { lastOK = pp; }
            pp = pp.Next;
        }
    }
    outRec.Pts = pp;
};
ClipperLib.Clipper.prototype.DupOutPt = function (outPt, InsertAfter) {
    var result = new ClipperLib.OutPt();
    result.Pt.X = outPt.Pt.X;
    result.Pt.Y = outPt.Pt.Y;
    if (ClipperLib.use_xyz) 
        { result.Pt.Z = outPt.Pt.Z; }
    result.Idx = outPt.Idx;
    if (InsertAfter) {
        result.Next = outPt.Next;
        result.Prev = outPt;
        outPt.Next.Prev = result;
        outPt.Next = result;
    } else {
        result.Prev = outPt.Prev;
        result.Next = outPt;
        outPt.Prev.Next = result;
        outPt.Prev = result;
    }
    return result;
};
ClipperLib.Clipper.prototype.GetOverlap = function (a1, a2, b1, b2, $val) {
    if (a1 < a2) {
        if (b1 < b2) {
            $val.Left = Math.max(a1, b1);
            $val.Right = Math.min(a2, b2);
        } else {
            $val.Left = Math.max(a1, b2);
            $val.Right = Math.min(a2, b1);
        }
    } else {
        if (b1 < b2) {
            $val.Left = Math.max(a2, b1);
            $val.Right = Math.min(a1, b2);
        } else {
            $val.Left = Math.max(a2, b2);
            $val.Right = Math.min(a1, b1);
        }
    }
    return $val.Left < $val.Right;
};
ClipperLib.Clipper.prototype.JoinHorz = function (op1, op1b, op2, op2b, Pt, DiscardLeft) {
    var Dir1 = op1.Pt.X > op1b.Pt.X ? ClipperLib.Direction.dRightToLeft : ClipperLib.Direction.dLeftToRight;
    var Dir2 = op2.Pt.X > op2b.Pt.X ? ClipperLib.Direction.dRightToLeft : ClipperLib.Direction.dLeftToRight;
    if (Dir1 === Dir2) 
        { return false; }
    if (Dir1 === ClipperLib.Direction.dLeftToRight) {
        while (op1.Next.Pt.X <= Pt.X && op1.Next.Pt.X >= op1.Pt.X && op1.Next.Pt.Y === Pt.Y) 
            { op1 = op1.Next; }
        if (DiscardLeft && op1.Pt.X !== Pt.X) 
            { op1 = op1.Next; }
        op1b = this.DupOutPt(op1, !DiscardLeft);
        if (ClipperLib.FPoint.op_Inequality(op1b.Pt, Pt)) {
            op1 = op1b;
            op1.Pt.X = Pt.X;
            op1.Pt.Y = Pt.Y;
            if (ClipperLib.use_xyz) 
                { op1.Pt.Z = Pt.Z; }
            op1b = this.DupOutPt(op1, !DiscardLeft);
        }
    } else {
        while (op1.Next.Pt.X >= Pt.X && op1.Next.Pt.X <= op1.Pt.X && op1.Next.Pt.Y === Pt.Y) 
            { op1 = op1.Next; }
        if (!DiscardLeft && op1.Pt.X !== Pt.X) 
            { op1 = op1.Next; }
        op1b = this.DupOutPt(op1, DiscardLeft);
        if (ClipperLib.FPoint.op_Inequality(op1b.Pt, Pt)) {
            op1 = op1b;
            op1.Pt.X = Pt.X;
            op1.Pt.Y = Pt.Y;
            if (ClipperLib.use_xyz) 
                { op1.Pt.Z = Pt.Z; }
            op1b = this.DupOutPt(op1, DiscardLeft);
        }
    }
    if (Dir2 === ClipperLib.Direction.dLeftToRight) {
        while (op2.Next.Pt.X <= Pt.X && op2.Next.Pt.X >= op2.Pt.X && op2.Next.Pt.Y === Pt.Y) 
            { op2 = op2.Next; }
        if (DiscardLeft && op2.Pt.X !== Pt.X) 
            { op2 = op2.Next; }
        op2b = this.DupOutPt(op2, !DiscardLeft);
        if (ClipperLib.FPoint.op_Inequality(op2b.Pt, Pt)) {
            op2 = op2b;
            op2.Pt.X = Pt.X;
            op2.Pt.Y = Pt.Y;
            if (ClipperLib.use_xyz) 
                { op2.Pt.Z = Pt.Z; }
            op2b = this.DupOutPt(op2, !DiscardLeft);
        }
    } else {
        while (op2.Next.Pt.X >= Pt.X && op2.Next.Pt.X <= op2.Pt.X && op2.Next.Pt.Y === Pt.Y) 
            { op2 = op2.Next; }
        if (!DiscardLeft && op2.Pt.X !== Pt.X) 
            { op2 = op2.Next; }
        op2b = this.DupOutPt(op2, DiscardLeft);
        if (ClipperLib.FPoint.op_Inequality(op2b.Pt, Pt)) {
            op2 = op2b;
            op2.Pt.X = Pt.X;
            op2.Pt.Y = Pt.Y;
            if (ClipperLib.use_xyz) 
                { op2.Pt.Z = Pt.Z; }
            op2b = this.DupOutPt(op2, DiscardLeft);
        }
    }
    if (Dir1 === ClipperLib.Direction.dLeftToRight === DiscardLeft) {
        op1.Prev = op2;
        op2.Next = op1;
        op1b.Next = op2b;
        op2b.Prev = op1b;
    } else {
        op1.Next = op2;
        op2.Prev = op1;
        op1b.Prev = op2b;
        op2b.Next = op1b;
    }
    return true;
};
ClipperLib.Clipper.prototype.JoinPoints = function (j, outRec1, outRec2) {
    var op1 = j.OutPt1, op1b = new ClipperLib.OutPt();
    var op2 = j.OutPt2, op2b = new ClipperLib.OutPt();
    var isHorizontal = j.OutPt1.Pt.Y === j.OffPt.Y;
    if (isHorizontal && ClipperLib.FPoint.op_Equality(j.OffPt, j.OutPt1.Pt) && ClipperLib.FPoint.op_Equality(j.OffPt, j.OutPt2.Pt)) {
        if (outRec1 !== outRec2) 
            { return false; }
        op1b = j.OutPt1.Next;
        while (op1b !== op1 && ClipperLib.FPoint.op_Equality(op1b.Pt, j.OffPt)) 
            { op1b = op1b.Next; }
        var reverse1 = op1b.Pt.Y > j.OffPt.Y;
        op2b = j.OutPt2.Next;
        while (op2b !== op2 && ClipperLib.FPoint.op_Equality(op2b.Pt, j.OffPt)) 
            { op2b = op2b.Next; }
        var reverse2 = op2b.Pt.Y > j.OffPt.Y;
        if (reverse1 === reverse2) 
            { return false; }
        if (reverse1) {
            op1b = this.DupOutPt(op1, false);
            op2b = this.DupOutPt(op2, true);
            op1.Prev = op2;
            op2.Next = op1;
            op1b.Next = op2b;
            op2b.Prev = op1b;
            j.OutPt1 = op1;
            j.OutPt2 = op1b;
            return true;
        } else {
            op1b = this.DupOutPt(op1, true);
            op2b = this.DupOutPt(op2, false);
            op1.Next = op2;
            op2.Prev = op1;
            op1b.Prev = op2b;
            op2b.Next = op1b;
            j.OutPt1 = op1;
            j.OutPt2 = op1b;
            return true;
        }
    } else if (isHorizontal) {
        op1b = op1;
        while (op1.Prev.Pt.Y === op1.Pt.Y && op1.Prev !== op1b && op1.Prev !== op2) 
            { op1 = op1.Prev; }
        while (op1b.Next.Pt.Y === op1b.Pt.Y && op1b.Next !== op1 && op1b.Next !== op2) 
            { op1b = op1b.Next; }
        if (op1b.Next === op1 || op1b.Next === op2) 
            { return false; }
        op2b = op2;
        while (op2.Prev.Pt.Y === op2.Pt.Y && op2.Prev !== op2b && op2.Prev !== op1b) 
            { op2 = op2.Prev; }
        while (op2b.Next.Pt.Y === op2b.Pt.Y && op2b.Next !== op2 && op2b.Next !== op1) 
            { op2b = op2b.Next; }
        if (op2b.Next === op2 || op2b.Next === op1) 
            { return false; }
        var $val = {
            Left: null,
            Right: null
        };
        if (!this.GetOverlap(op1.Pt.X, op1b.Pt.X, op2.Pt.X, op2b.Pt.X, $val)) 
            { return false; }
        var Left = $val.Left;
        var Right = $val.Right;
        var Pt = new ClipperLib.FPoint0();
        var DiscardLeftSide;
        if (op1.Pt.X >= Left && op1.Pt.X <= Right) {
            Pt.X = op1.Pt.X;
            Pt.Y = op1.Pt.Y;
            if (ClipperLib.use_xyz) 
                { Pt.Z = op1.Pt.Z; }
            DiscardLeftSide = op1.Pt.X > op1b.Pt.X;
        } else if (op2.Pt.X >= Left && op2.Pt.X <= Right) {
            Pt.X = op2.Pt.X;
            Pt.Y = op2.Pt.Y;
            if (ClipperLib.use_xyz) 
                { Pt.Z = op2.Pt.Z; }
            DiscardLeftSide = op2.Pt.X > op2b.Pt.X;
        } else if (op1b.Pt.X >= Left && op1b.Pt.X <= Right) {
            Pt.X = op1b.Pt.X;
            Pt.Y = op1b.Pt.Y;
            if (ClipperLib.use_xyz) 
                { Pt.Z = op1b.Pt.Z; }
            DiscardLeftSide = op1b.Pt.X > op1.Pt.X;
        } else {
            Pt.X = op2b.Pt.X;
            Pt.Y = op2b.Pt.Y;
            if (ClipperLib.use_xyz) 
                { Pt.Z = op2b.Pt.Z; }
            DiscardLeftSide = op2b.Pt.X > op2.Pt.X;
        }
        j.OutPt1 = op1;
        j.OutPt2 = op2;
        return this.JoinHorz(op1, op1b, op2, op2b, Pt, DiscardLeftSide);
    } else {
        op1b = op1.Next;
        while (ClipperLib.FPoint.op_Equality(op1b.Pt, op1.Pt) && op1b !== op1) 
            { op1b = op1b.Next; }
        var Reverse1 = op1b.Pt.Y > op1.Pt.Y || !ClipperLib.ClipperBase.SlopesEqual4(op1.Pt, op1b.Pt, j.OffPt);
        if (Reverse1) {
            op1b = op1.Prev;
            while (ClipperLib.FPoint.op_Equality(op1b.Pt, op1.Pt) && op1b !== op1) 
                { op1b = op1b.Prev; }
            if (op1b.Pt.Y > op1.Pt.Y || !ClipperLib.ClipperBase.SlopesEqual4(op1.Pt, op1b.Pt, j.OffPt)) 
                { return false; }
        }
        op2b = op2.Next;
        while (ClipperLib.FPoint.op_Equality(op2b.Pt, op2.Pt) && op2b !== op2) 
            { op2b = op2b.Next; }
        var Reverse2 = op2b.Pt.Y > op2.Pt.Y || !ClipperLib.ClipperBase.SlopesEqual4(op2.Pt, op2b.Pt, j.OffPt);
        if (Reverse2) {
            op2b = op2.Prev;
            while (ClipperLib.FPoint.op_Equality(op2b.Pt, op2.Pt) && op2b !== op2) 
                { op2b = op2b.Prev; }
            if (op2b.Pt.Y > op2.Pt.Y || !ClipperLib.ClipperBase.SlopesEqual4(op2.Pt, op2b.Pt, j.OffPt)) 
                { return false; }
        }
        if (op1b === op1 || op2b === op2 || op1b === op2b || outRec1 === outRec2 && Reverse1 === Reverse2) 
            { return false; }
        if (Reverse1) {
            op1b = this.DupOutPt(op1, false);
            op2b = this.DupOutPt(op2, true);
            op1.Prev = op2;
            op2.Next = op1;
            op1b.Next = op2b;
            op2b.Prev = op1b;
            j.OutPt1 = op1;
            j.OutPt2 = op1b;
            return true;
        } else {
            op1b = this.DupOutPt(op1, true);
            op2b = this.DupOutPt(op2, false);
            op1.Next = op2;
            op2.Prev = op1;
            op1b.Prev = op2b;
            op2b.Next = op1b;
            j.OutPt1 = op1;
            j.OutPt2 = op1b;
            return true;
        }
    }
};
ClipperLib.Clipper.GetBounds = function (paths) {
    var i = 0, cnt = paths.length;
    while (i < cnt && paths[i].length === 0) 
        { i++; }
    if (i === cnt) 
        { return new ClipperLib.FRect(0, 0, 0, 0); }
    var result = new ClipperLib.FRect();
    result.left = paths[i][0].X;
    result.right = result.left;
    result.top = paths[i][0].Y;
    result.bottom = result.top;
    for (; i < cnt; i++) 
        { for (var j = 0, jlen = paths[i].length;j < jlen; j++) {
        if (paths[i][j].X < result.left) 
            { result.left = paths[i][j].X; }
         else if (paths[i][j].X > result.right) 
            { result.right = paths[i][j].X; }
        if (paths[i][j].Y < result.top) 
            { result.top = paths[i][j].Y; }
         else if (paths[i][j].Y > result.bottom) 
            { result.bottom = paths[i][j].Y; }
    } }
    return result;
};
ClipperLib.Clipper.prototype.GetBounds2 = function (ops) {
    var opStart = ops;
    var result = new ClipperLib.FRect();
    result.left = ops.Pt.X;
    result.right = ops.Pt.X;
    result.top = ops.Pt.Y;
    result.bottom = ops.Pt.Y;
    ops = ops.Next;
    while (ops !== opStart) {
        if (ops.Pt.X < result.left) 
            { result.left = ops.Pt.X; }
        if (ops.Pt.X > result.right) 
            { result.right = ops.Pt.X; }
        if (ops.Pt.Y < result.top) 
            { result.top = ops.Pt.Y; }
        if (ops.Pt.Y > result.bottom) 
            { result.bottom = ops.Pt.Y; }
        ops = ops.Next;
    }
    return result;
};
ClipperLib.Clipper.PointInPolygon = function (pt, path) {
    var result = 0, cnt = path.length;
    if (cnt < 3) 
        { return 0; }
    var ip = path[0];
    for (var i = 1;i <= cnt; ++i) {
        var ipNext = i === cnt ? path[0] : path[i];
        if (ipNext.Y === pt.Y) {
            if (ipNext.X === pt.X || ip.Y === pt.Y && ipNext.X > pt.X === ip.X < pt.X) 
                { return -1; }
        }
        if (ip.Y < pt.Y !== ipNext.Y < pt.Y) {
            if (ip.X >= pt.X) {
                if (ipNext.X > pt.X) 
                    { result = 1 - result; }
                 else {
                    var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
                    if (d === 0) 
                        { return -1; }
                     else if (d > 0 === ipNext.Y > ip.Y) 
                        { result = 1 - result; }
                }
            } else {
                if (ipNext.X > pt.X) {
                    var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
                    if (d === 0) 
                        { return -1; }
                     else if (d > 0 === ipNext.Y > ip.Y) 
                        { result = 1 - result; }
                }
            }
        }
        ip = ipNext;
    }
    return result;
};
ClipperLib.Clipper.prototype.PointInPolygon = function (pt, op) {
    var result = 0;
    var startOp = op;
    var ptx = pt.X, pty = pt.Y;
    var poly0x = op.Pt.X, poly0y = op.Pt.Y;
    do {
        op = op.Next;
        var poly1x = op.Pt.X, poly1y = op.Pt.Y;
        if (poly1y === pty) {
            if (poly1x === ptx || poly0y === pty && poly1x > ptx === poly0x < ptx) 
                { return -1; }
        }
        if (poly0y < pty !== poly1y < pty) {
            if (poly0x >= ptx) {
                if (poly1x > ptx) 
                    { result = 1 - result; }
                 else {
                    var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
                    if (d === 0) 
                        { return -1; }
                    if (d > 0 === poly1y > poly0y) 
                        { result = 1 - result; }
                }
            } else {
                if (poly1x > ptx) {
                    var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
                    if (d === 0) 
                        { return -1; }
                    if (d > 0 === poly1y > poly0y) 
                        { result = 1 - result; }
                }
            }
        }
        poly0x = poly1x;
        poly0y = poly1y;
    } while (startOp !== op);
    return result;
};
ClipperLib.Clipper.prototype.Poly2ContainsPoly1 = function (outPt1, outPt2) {
    var this$1 = this;

    var op = outPt1;
    do {
        var res = this$1.PointInPolygon(op.Pt, outPt2);
        if (res >= 0) 
            { return res > 0; }
        op = op.Next;
    } while (op !== outPt1);
    return true;
};
ClipperLib.Clipper.prototype.FixupFirstLefts1 = function (OldOutRec, NewOutRec) {
    var this$1 = this;

    var outRec, firstLeft;
    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; i++) {
        outRec = this$1.m_PolyOuts[i];
        firstLeft = ClipperLib.Clipper.ParseFirstLeft(outRec.FirstLeft);
        if (outRec.Pts !== null && firstLeft === OldOutRec) {
            if (this$1.Poly2ContainsPoly1(outRec.Pts, NewOutRec.Pts)) 
                { outRec.FirstLeft = NewOutRec; }
        }
    }
};
ClipperLib.Clipper.prototype.FixupFirstLefts2 = function (innerOutRec, outerOutRec) {
    var this$1 = this;

    var orfl = outerOutRec.FirstLeft;
    var outRec, firstLeft;
    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; i++) {
        outRec = this$1.m_PolyOuts[i];
        if (outRec.Pts === null || outRec === outerOutRec || outRec === innerOutRec) 
            { continue; }
        firstLeft = ClipperLib.Clipper.ParseFirstLeft(outRec.FirstLeft);
        if (firstLeft !== orfl && firstLeft !== innerOutRec && firstLeft !== outerOutRec) 
            { continue; }
        if (this$1.Poly2ContainsPoly1(outRec.Pts, innerOutRec.Pts)) 
            { outRec.FirstLeft = innerOutRec; }
         else if (this$1.Poly2ContainsPoly1(outRec.Pts, outerOutRec.Pts)) 
            { outRec.FirstLeft = outerOutRec; }
         else if (outRec.FirstLeft === innerOutRec || outRec.FirstLeft === outerOutRec) 
            { outRec.FirstLeft = orfl; }
    }
};
ClipperLib.Clipper.prototype.FixupFirstLefts3 = function (OldOutRec, NewOutRec) {
    var this$1 = this;

    var outRec;
    var firstLeft;
    for (var i = 0, ilen = this.m_PolyOuts.length;i < ilen; i++) {
        outRec = this$1.m_PolyOuts[i];
        firstLeft = ClipperLib.Clipper.ParseFirstLeft(outRec.FirstLeft);
        if (outRec.Pts !== null && firstLeft === OldOutRec) 
            { outRec.FirstLeft = NewOutRec; }
    }
};
ClipperLib.Clipper.ParseFirstLeft = function (FirstLeft) {
    while (FirstLeft !== null && FirstLeft.Pts === null) 
        { FirstLeft = FirstLeft.FirstLeft; }
    return FirstLeft;
};
ClipperLib.Clipper.prototype.JoinCommonEdges = function () {
    var this$1 = this;

    for (var i = 0, ilen = this.m_Joins.length;i < ilen; i++) {
        var join = this$1.m_Joins[i];
        var outRec1 = this$1.GetOutRec(join.OutPt1.Idx);
        var outRec2 = this$1.GetOutRec(join.OutPt2.Idx);
        if (outRec1.Pts === null || outRec2.Pts === null) 
            { continue; }
        if (outRec1.IsOpen || outRec2.IsOpen) {
            continue;
        }
        var holeStateRec;
        if (outRec1 === outRec2) 
            { holeStateRec = outRec1; }
         else if (this$1.OutRec1RightOfOutRec2(outRec1, outRec2)) 
            { holeStateRec = outRec2; }
         else if (this$1.OutRec1RightOfOutRec2(outRec2, outRec1)) 
            { holeStateRec = outRec1; }
         else 
            { holeStateRec = this$1.GetLowermostRec(outRec1, outRec2); }
        if (!this$1.JoinPoints(join, outRec1, outRec2)) 
            { continue; }
        if (outRec1 === outRec2) {
            outRec1.Pts = join.OutPt1;
            outRec1.BottomPt = null;
            outRec2 = this$1.CreateOutRec();
            outRec2.Pts = join.OutPt2;
            this$1.UpdateOutPtIdxs(outRec2);
            if (this$1.Poly2ContainsPoly1(outRec2.Pts, outRec1.Pts)) {
                outRec2.IsHole = !outRec1.IsHole;
                outRec2.FirstLeft = outRec1;
                if (this$1.m_UsingPolyTree) 
                    { this$1.FixupFirstLefts2(outRec2, outRec1); }
                if ((outRec2.IsHole ^ this$1.ReverseSolution) == this$1.Area$1(outRec2) > 0) 
                    { this$1.ReversePolyPtLinks(outRec2.Pts); }
            } else if (this$1.Poly2ContainsPoly1(outRec1.Pts, outRec2.Pts)) {
                outRec2.IsHole = outRec1.IsHole;
                outRec1.IsHole = !outRec2.IsHole;
                outRec2.FirstLeft = outRec1.FirstLeft;
                outRec1.FirstLeft = outRec2;
                if (this$1.m_UsingPolyTree) 
                    { this$1.FixupFirstLefts2(outRec1, outRec2); }
                if ((outRec1.IsHole ^ this$1.ReverseSolution) == this$1.Area$1(outRec1) > 0) 
                    { this$1.ReversePolyPtLinks(outRec1.Pts); }
            } else {
                outRec2.IsHole = outRec1.IsHole;
                outRec2.FirstLeft = outRec1.FirstLeft;
                if (this$1.m_UsingPolyTree) 
                    { this$1.FixupFirstLefts1(outRec1, outRec2); }
            }
        } else {
            outRec2.Pts = null;
            outRec2.BottomPt = null;
            outRec2.Idx = outRec1.Idx;
            outRec1.IsHole = holeStateRec.IsHole;
            if (holeStateRec === outRec2) 
                { outRec1.FirstLeft = outRec2.FirstLeft; }
            outRec2.FirstLeft = outRec1;
            if (this$1.m_UsingPolyTree) 
                { this$1.FixupFirstLefts3(outRec2, outRec1); }
        }
    }
};
ClipperLib.Clipper.prototype.UpdateOutPtIdxs = function (outrec) {
    var op = outrec.Pts;
    do {
        op.Idx = outrec.Idx;
        op = op.Prev;
    } while (op !== outrec.Pts);
};
ClipperLib.Clipper.prototype.DoSimplePolygons = function () {
    var this$1 = this;

    var i = 0;
    while (i < this.m_PolyOuts.length) {
        var outrec = this$1.m_PolyOuts[i++];
        var op = outrec.Pts;
        if (op === null || outrec.IsOpen) 
            { continue; }
        do {
            var op2 = op.Next;
            while (op2 !== outrec.Pts) {
                if (ClipperLib.FPoint.op_Equality(op.Pt, op2.Pt) && op2.Next !== op && op2.Prev !== op) {
                    var op3 = op.Prev;
                    var op4 = op2.Prev;
                    op.Prev = op4;
                    op4.Next = op;
                    op2.Prev = op3;
                    op3.Next = op2;
                    outrec.Pts = op;
                    var outrec2 = this$1.CreateOutRec();
                    outrec2.Pts = op2;
                    this$1.UpdateOutPtIdxs(outrec2);
                    if (this$1.Poly2ContainsPoly1(outrec2.Pts, outrec.Pts)) {
                        outrec2.IsHole = !outrec.IsHole;
                        outrec2.FirstLeft = outrec;
                        if (this$1.m_UsingPolyTree) 
                            { this$1.FixupFirstLefts2(outrec2, outrec); }
                    } else if (this$1.Poly2ContainsPoly1(outrec.Pts, outrec2.Pts)) {
                        outrec2.IsHole = outrec.IsHole;
                        outrec.IsHole = !outrec2.IsHole;
                        outrec2.FirstLeft = outrec.FirstLeft;
                        outrec.FirstLeft = outrec2;
                        if (this$1.m_UsingPolyTree) 
                            { this$1.FixupFirstLefts2(outrec, outrec2); }
                    } else {
                        outrec2.IsHole = outrec.IsHole;
                        outrec2.FirstLeft = outrec.FirstLeft;
                        if (this$1.m_UsingPolyTree) 
                            { this$1.FixupFirstLefts1(outrec, outrec2); }
                    }
                    op2 = op;
                }
                op2 = op2.Next;
            }
            op = op.Next;
        } while (op !== outrec.Pts);
    }
};
ClipperLib.Clipper.Area = function (poly) {
    if (!Array.isArray(poly)) 
        { return 0; }
    var cnt = poly.length;
    if (cnt < 3) 
        { return 0; }
    var a = 0;
    for (var i = 0, j = cnt - 1;i < cnt; ++i) {
        a += (poly[j].X + poly[i].X) * (poly[j].Y - poly[i].Y);
        j = i;
    }
    return -a * 0.5;
};
ClipperLib.Clipper.prototype.Area = function (op) {
    var opFirst = op;
    if (op === null) 
        { return 0; }
    var a = 0;
    do {
        a = a + (op.Prev.Pt.X + op.Pt.X) * (op.Prev.Pt.Y - op.Pt.Y);
        op = op.Next;
    } while (op !== opFirst);
    return a * 0.5;
};
ClipperLib.Clipper.prototype.Area$1 = function (outRec) {
    return this.Area(outRec.Pts);
};
ClipperLib.Clipper.SimplifyPolygon = function (poly, fillType) {
    var result = new Array();
    var c = new ClipperLib.Clipper(0);
    c.StrictlySimple = true;
    c.AddPath(poly, ClipperLib.PolyType.ptSubject, true);
    c.Execute(ClipperLib.ClipType.ctUnion, result, fillType, fillType);
    return result;
};
ClipperLib.Clipper.SimplifyPolygons = function (polys, fillType) {
    if (typeof fillType === "undefined") 
        { fillType = ClipperLib.PolyFillType.pftEvenOdd; }
    var result = new Array();
    var c = new ClipperLib.Clipper(0);
    c.StrictlySimple = true;
    c.AddPaths(polys, ClipperLib.PolyType.ptSubject, true);
    c.Execute(ClipperLib.ClipType.ctUnion, result, fillType, fillType);
    return result;
};
ClipperLib.Clipper.DistanceSqrd = function (pt1, pt2) {
    var dx = pt1.X - pt2.X;
    var dy = pt1.Y - pt2.Y;
    return dx * dx + dy * dy;
};
ClipperLib.Clipper.DistanceFromLineSqrd = function (pt, ln1, ln2) {
    var A = ln1.Y - ln2.Y;
    var B = ln2.X - ln1.X;
    var C = A * ln1.X + B * ln1.Y;
    C = A * pt.X + B * pt.Y - C;
    return C * C / (A * A + B * B);
};
ClipperLib.Clipper.SlopesNearCollinear = function (pt1, pt2, pt3, distSqrd) {
    if (Math.abs(pt1.X - pt2.X) > Math.abs(pt1.Y - pt2.Y)) {
        if (pt1.X > pt2.X === pt1.X < pt3.X) 
            { return ClipperLib.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd; }
         else if (pt2.X > pt1.X === pt2.X < pt3.X) 
            { return ClipperLib.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd; }
         else 
            { return ClipperLib.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd; }
    } else {
        if (pt1.Y > pt2.Y === pt1.Y < pt3.Y) 
            { return ClipperLib.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd; }
         else if (pt2.Y > pt1.Y === pt2.Y < pt3.Y) 
            { return ClipperLib.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd; }
         else 
            { return ClipperLib.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd; }
    }
};
ClipperLib.Clipper.PointsAreClose = function (pt1, pt2, distSqrd) {
    var dx = pt1.X - pt2.X;
    var dy = pt1.Y - pt2.Y;
    return dx * dx + dy * dy <= distSqrd;
};
ClipperLib.Clipper.ExcludeOp = function (op) {
    var result = op.Prev;
    result.Next = op.Next;
    op.Next.Prev = result;
    result.Idx = 0;
    return result;
};
ClipperLib.Clipper.CleanPolygon = function (path, distance) {
    if (typeof distance === "undefined") 
        { distance = 1.415; }
    var cnt = path.length;
    if (cnt === 0) 
        { return new Array(); }
    var outPts = new Array(cnt);
    for (var i = 0;i < cnt; ++i) 
        { outPts[i] = new ClipperLib.OutPt(); }
    for (var i = 0;i < cnt; ++i) {
        outPts[i].Pt = path[i];
        outPts[i].Next = outPts[(i + 1) % cnt];
        outPts[i].Next.Prev = outPts[i];
        outPts[i].Idx = 0;
    }
    var distSqrd = distance * distance;
    var op = outPts[0];
    while (op.Idx === 0 && op.Next !== op.Prev) {
        if (ClipperLib.Clipper.PointsAreClose(op.Pt, op.Prev.Pt, distSqrd)) {
            op = ClipperLib.Clipper.ExcludeOp(op);
            cnt--;
        } else if (ClipperLib.Clipper.PointsAreClose(op.Prev.Pt, op.Next.Pt, distSqrd)) {
            ClipperLib.Clipper.ExcludeOp(op.Next);
            op = ClipperLib.Clipper.ExcludeOp(op);
            cnt -= 2;
        } else if (ClipperLib.Clipper.SlopesNearCollinear(op.Prev.Pt, op.Pt, op.Next.Pt, distSqrd)) {
            op = ClipperLib.Clipper.ExcludeOp(op);
            cnt--;
        } else {
            op.Idx = 1;
            op = op.Next;
        }
    }
    if (cnt < 3) 
        { cnt = 0; }
    var result = new Array(cnt);
    for (var i = 0;i < cnt; ++i) {
        result[i] = new ClipperLib.FPoint1(op.Pt);
        op = op.Next;
    }
    outPts = null;
    return result;
};
ClipperLib.Clipper.CleanPolygons = function (polys, distance) {
    var result = new Array(polys.length);
    for (var i = 0, ilen = polys.length;i < ilen; i++) 
        { result[i] = ClipperLib.Clipper.CleanPolygon(polys[i], distance); }
    return result;
};
ClipperLib.Clipper.Minkowski = function (pattern, path, IsSum, IsClosed) {
    var delta = IsClosed ? 1 : 0;
    var polyCnt = pattern.length;
    var pathCnt = path.length;
    var result = new Array();
    if (IsSum) 
        { for (var i = 0;i < pathCnt; i++) {
        var p = new Array(polyCnt);
        for (var j = 0, jlen = pattern.length, ip = pattern[j];j < jlen; j++, ip = pattern[j]) 
            { p[j] = new ClipperLib.FPoint2(path[i].X + ip.X, path[i].Y + ip.Y); }
        result.push(p);
    } }
     else 
        { for (var i = 0;i < pathCnt; i++) {
        var p = new Array(polyCnt);
        for (var j = 0, jlen = pattern.length, ip = pattern[j];j < jlen; j++, ip = pattern[j]) 
            { p[j] = new ClipperLib.FPoint2(path[i].X - ip.X, path[i].Y - ip.Y); }
        result.push(p);
    } }
    var quads = new Array();
    for (var i = 0;i < pathCnt - 1 + delta; i++) 
        { for (var j = 0;j < polyCnt; j++) {
        var quad = new Array();
        quad.push(result[i % pathCnt][j % polyCnt]);
        quad.push(result[(i + 1) % pathCnt][j % polyCnt]);
        quad.push(result[(i + 1) % pathCnt][(j + 1) % polyCnt]);
        quad.push(result[i % pathCnt][(j + 1) % polyCnt]);
        if (!ClipperLib.Clipper.Orientation(quad)) 
            { quad.reverse(); }
        quads.push(quad);
    } }
    return quads;
};
ClipperLib.Clipper.MinkowskiSum = function (pattern, path_or_paths, pathIsClosed) {
    if (!(path_or_paths[0] instanceof Array)) {
        var path = path_or_paths;
        var paths = ClipperLib.Clipper.Minkowski(pattern, path, true, pathIsClosed);
        var c = new ClipperLib.Clipper();
        c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
        c.Execute(ClipperLib.ClipType.ctUnion, paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        return paths;
    } else {
        var paths = path_or_paths;
        var solution = new ClipperLib.Paths();
        var c = new ClipperLib.Clipper();
        for (var i = 0;i < paths.length; ++i) {
            var tmp = ClipperLib.Clipper.Minkowski(pattern, paths[i], true, pathIsClosed);
            c.AddPaths(tmp, ClipperLib.PolyType.ptSubject, true);
            if (pathIsClosed) {
                var path = ClipperLib.Clipper.TranslatePath(paths[i], pattern[0]);
                c.AddPath(path, ClipperLib.PolyType.ptClip, true);
            }
        }
        c.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
        return solution;
    }
};
ClipperLib.Clipper.TranslatePath = function (path, delta) {
    var outPath = new ClipperLib.Path();
    for (var i = 0;i < path.length; i++) 
        { outPath.push(new ClipperLib.FPoint2(path[i].X + delta.X, path[i].Y + delta.Y)); }
    return outPath;
};
ClipperLib.Clipper.MinkowskiDiff = function (poly1, poly2) {
    var paths = ClipperLib.Clipper.Minkowski(poly1, poly2, false, true);
    var c = new ClipperLib.Clipper();
    c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
    c.Execute(ClipperLib.ClipType.ctUnion, paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    return paths;
};
ClipperLib.Clipper.PolyTreeToPaths = function (polytree) {
    var result = new Array();
    ClipperLib.Clipper.AddPolyNodeToPaths(polytree, ClipperLib.Clipper.NodeType.ntAny, result);
    return result;
};
ClipperLib.Clipper.AddPolyNodeToPaths = function (polynode, nt, paths) {
    var match = true;
    switch (nt) {
        case ClipperLib.Clipper.NodeType.ntOpen:
            return;
        case ClipperLib.Clipper.NodeType.ntClosed:
            match = !polynode.IsOpen;
            break;
        default:
            break;
    }
    if (polynode.m_polygon.length > 0 && match) 
        { paths.push(polynode.m_polygon); }
    for (var $i3 = 0, $t3 = polynode.Childs(), $l3 = $t3.length, pn = $t3[$i3];$i3 < $l3; $i3++, pn = $t3[$i3]) 
        { ClipperLib.Clipper.AddPolyNodeToPaths(pn, nt, paths); }
};
ClipperLib.Clipper.OpenPathsFromPolyTree = function (polytree) {
    var result = new ClipperLib.Paths();
    for (var i = 0, ilen = polytree.ChildCount();i < ilen; i++) 
        { if (polytree.Childs()[i].IsOpen) 
        { result.push(polytree.Childs()[i].m_polygon); } }
    return result;
};
ClipperLib.Clipper.ClosedPathsFromPolyTree = function (polytree) {
    var result = new ClipperLib.Paths();
    ClipperLib.Clipper.AddPolyNodeToPaths(polytree, ClipperLib.Clipper.NodeType.ntClosed, result);
    return result;
};
Inherit(ClipperLib.Clipper, ClipperLib.ClipperBase);
ClipperLib.Clipper.NodeType = {
    ntAny: 0,
    ntOpen: 1,
    ntClosed: 2
};
ClipperLib.ClipperOffset = function (miterLimit, arcTolerance) {
    if (typeof miterLimit === "undefined") 
        { miterLimit = 2; }
    if (typeof arcTolerance === "undefined") 
        { arcTolerance = ClipperLib.ClipperOffset.def_arc_tolerance; }
    this.m_destPolys = new ClipperLib.Paths();
    this.m_srcPoly = new ClipperLib.Path();
    this.m_destPoly = new ClipperLib.Path();
    this.m_normals = new Array();
    this.m_delta = 0;
    this.m_sinA = 0;
    this.m_sin = 0;
    this.m_cos = 0;
    this.m_miterLim = 0;
    this.m_StepsPerRad = 0;
    this.m_lowest = new ClipperLib.FPoint0();
    this.m_polyNodes = new ClipperLib.PolyNode();
    this.MiterLimit = miterLimit;
    this.ArcTolerance = arcTolerance;
    this.m_lowest.X = -1;
};
ClipperLib.ClipperOffset.two_pi = 6.28318530717959;
ClipperLib.ClipperOffset.def_arc_tolerance = 0.25;
ClipperLib.ClipperOffset.prototype.Clear = function () {
    ClipperLib.Clear(this.m_polyNodes.Childs());
    this.m_lowest.X = -1;
};
ClipperLib.ClipperOffset.prototype.AddPath = function (path, joinType, endType) {
    var highI = path.length - 1;
    if (highI < 0) 
        { return; }
    var newNode = new ClipperLib.PolyNode();
    newNode.m_jointype = joinType;
    newNode.m_endtype = endType;
    if (endType === ClipperLib.EndType.etClosedLine || endType === ClipperLib.EndType.etClosedPolygon) 
        { while (highI > 0 && ClipperLib.FPoint.op_Equality(path[0], path[highI])) 
        { highI--; } }
    newNode.m_polygon.push(path[0]);
    var j = 0, k = 0;
    for (var i = 1;i <= highI; i++) 
        { if (ClipperLib.FPoint.op_Inequality(newNode.m_polygon[j], path[i])) {
        j++;
        newNode.m_polygon.push(path[i]);
        if (path[i].Y > newNode.m_polygon[k].Y || path[i].Y === newNode.m_polygon[k].Y && path[i].X < newNode.m_polygon[k].X) 
            { k = j; }
    } }
    if (endType === ClipperLib.EndType.etClosedPolygon && j < 2) 
        { return; }
    this.m_polyNodes.AddChild(newNode);
    if (endType !== ClipperLib.EndType.etClosedPolygon) 
        { return; }
    if (this.m_lowest.X < 0) 
        { this.m_lowest = new ClipperLib.FPoint2(this.m_polyNodes.ChildCount() - 1, k); }
     else {
        var ip = this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y];
        if (newNode.m_polygon[k].Y > ip.Y || newNode.m_polygon[k].Y === ip.Y && newNode.m_polygon[k].X < ip.X) 
            { this.m_lowest = new ClipperLib.FPoint2(this.m_polyNodes.ChildCount() - 1, k); }
    }
};
ClipperLib.ClipperOffset.prototype.AddPaths = function (paths, joinType, endType) {
    var this$1 = this;

    for (var i = 0, ilen = paths.length;i < ilen; i++) 
        { this$1.AddPath(paths[i], joinType, endType); }
};
ClipperLib.ClipperOffset.prototype.FixOrientations = function () {
    var this$1 = this;

    if (this.m_lowest.X >= 0 && !ClipperLib.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon)) {
        for (var i = 0;i < this.m_polyNodes.ChildCount(); i++) {
            var node = this$1.m_polyNodes.Childs()[i];
            if (node.m_endtype === ClipperLib.EndType.etClosedPolygon || node.m_endtype === ClipperLib.EndType.etClosedLine && ClipperLib.Clipper.Orientation(node.m_polygon)) 
                { node.m_polygon.reverse(); }
        }
    } else {
        for (var i = 0;i < this.m_polyNodes.ChildCount(); i++) {
            var node = this$1.m_polyNodes.Childs()[i];
            if (node.m_endtype === ClipperLib.EndType.etClosedLine && !ClipperLib.Clipper.Orientation(node.m_polygon)) 
                { node.m_polygon.reverse(); }
        }
    }
};
ClipperLib.ClipperOffset.GetUnitNormal = function (pt1, pt2) {
    var dx = pt2.X - pt1.X;
    var dy = pt2.Y - pt1.Y;
    if (dx === 0 && dy === 0) 
        { return new ClipperLib.FPoint2(0, 0); }
    var f = 1 / Math.sqrt(dx * dx + dy * dy);
    dx *= f;
    dy *= f;
    return new ClipperLib.FPoint2(dy, -dx);
};
ClipperLib.ClipperOffset.prototype.DoOffset = function (delta) {
    var this$1 = this;

    this.m_destPolys = new Array();
    this.m_delta = delta;
    if (ClipperLib.ClipperBase.near_zero(delta)) {
        for (var i = 0;i < this.m_polyNodes.ChildCount(); i++) {
            var node = this$1.m_polyNodes.Childs()[i];
            if (node.m_endtype === ClipperLib.EndType.etClosedPolygon) 
                { this$1.m_destPolys.push(node.m_polygon); }
        }
        return;
    }
    if (this.MiterLimit > 2) 
        { this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit); }
     else 
        { this.m_miterLim = 0.5; }
    var y;
    if (this.ArcTolerance <= 0) 
        { y = ClipperLib.ClipperOffset.def_arc_tolerance; }
     else if (this.ArcTolerance > Math.abs(delta) * ClipperLib.ClipperOffset.def_arc_tolerance) 
        { y = Math.abs(delta) * ClipperLib.ClipperOffset.def_arc_tolerance; }
     else 
        { y = this.ArcTolerance; }
    var steps = 3.14159265358979 / Math.acos(1 - y / Math.abs(delta));
    this.m_sin = Math.sin(ClipperLib.ClipperOffset.two_pi / steps);
    this.m_cos = Math.cos(ClipperLib.ClipperOffset.two_pi / steps);
    this.m_StepsPerRad = steps / ClipperLib.ClipperOffset.two_pi;
    if (delta < 0) 
        { this.m_sin = -this.m_sin; }
    for (var i = 0;i < this.m_polyNodes.ChildCount(); i++) {
        var node = this$1.m_polyNodes.Childs()[i];
        this$1.m_srcPoly = node.m_polygon;
        var len = this$1.m_srcPoly.length;
        if (len === 0 || delta <= 0 && (len < 3 || node.m_endtype !== ClipperLib.EndType.etClosedPolygon)) 
            { continue; }
        this$1.m_destPoly = new Array();
        if (len === 1) {
            if (node.m_jointype === ClipperLib.JoinType.jtRound) {
                var X = 1, Y = 0;
                for (var j = 1;j <= steps; j++) {
                    this$1.m_destPoly.push(new ClipperLib.FPoint2(this$1.m_srcPoly[0].X + X * delta, this$1.m_srcPoly[0].Y + Y * delta));
                    var X2 = X;
                    X = X * this$1.m_cos - this$1.m_sin * Y;
                    Y = X2 * this$1.m_sin + Y * this$1.m_cos;
                }
            } else {
                var X = -1, Y = -1;
                for (var j = 0;j < 4; ++j) {
                    this$1.m_destPoly.push(new ClipperLib.FPoint2(this$1.m_srcPoly[0].X + X * delta, this$1.m_srcPoly[0].Y + Y * delta));
                    if (X < 0) 
                        { X = 1; }
                     else if (Y < 0) 
                        { Y = 1; }
                     else 
                        { X = -1; }
                }
            }
            this$1.m_destPolys.push(this$1.m_destPoly);
            continue;
        }
        this$1.m_normals.length = 0;
        for (var j = 0;j < len - 1; j++) 
            { this$1.m_normals.push(ClipperLib.ClipperOffset.GetUnitNormal(this$1.m_srcPoly[j], this$1.m_srcPoly[j + 1])); }
        if (node.m_endtype === ClipperLib.EndType.etClosedLine || node.m_endtype === ClipperLib.EndType.etClosedPolygon) 
            { this$1.m_normals.push(ClipperLib.ClipperOffset.GetUnitNormal(this$1.m_srcPoly[len - 1], this$1.m_srcPoly[0])); }
         else 
            { this$1.m_normals.push(new ClipperLib.FPoint1(this$1.m_normals[len - 2])); }
        if (node.m_endtype === ClipperLib.EndType.etClosedPolygon) {
            var k = len - 1;
            for (var j = 0;j < len; j++) 
                { k = this$1.OffsetPoint(j, k, node.m_jointype); }
            this$1.m_destPolys.push(this$1.m_destPoly);
        } else if (node.m_endtype === ClipperLib.EndType.etClosedLine) {
            var k = len - 1;
            for (var j = 0;j < len; j++) 
                { k = this$1.OffsetPoint(j, k, node.m_jointype); }
            this$1.m_destPolys.push(this$1.m_destPoly);
            this$1.m_destPoly = new Array();
            var n = this$1.m_normals[len - 1];
            for (var j = len - 1;j > 0; j--) 
                { this$1.m_normals[j] = new ClipperLib.FPoint2(-this$1.m_normals[j - 1].X, -this$1.m_normals[j - 1].Y); }
            this$1.m_normals[0] = new ClipperLib.FPoint2(-n.X, -n.Y);
            k = 0;
            for (var j = len - 1;j >= 0; j--) 
                { k = this$1.OffsetPoint(j, k, node.m_jointype); }
            this$1.m_destPolys.push(this$1.m_destPoly);
        } else {
            var k = 0;
            for (var j = 1;j < len - 1; ++j) 
                { k = this$1.OffsetPoint(j, k, node.m_jointype); }
            var pt1;
            if (node.m_endtype === ClipperLib.EndType.etOpenButt) {
                var j = len - 1;
                pt1 = new ClipperLib.FPoint2(this$1.m_srcPoly[j].X + this$1.m_normals[j].X * delta, this$1.m_srcPoly[j].Y + this$1.m_normals[j].Y * delta);
                this$1.m_destPoly.push(pt1);
                pt1 = new ClipperLib.FPoint2(this$1.m_srcPoly[j].X - this$1.m_normals[j].X * delta, this$1.m_srcPoly[j].Y - this$1.m_normals[j].Y * delta);
                this$1.m_destPoly.push(pt1);
            } else {
                var j = len - 1;
                k = len - 2;
                this$1.m_sinA = 0;
                this$1.m_normals[j] = new ClipperLib.FPoint2(-this$1.m_normals[j].X, -this$1.m_normals[j].Y);
                if (node.m_endtype === ClipperLib.EndType.etOpenSquare) 
                    { this$1.DoSquare(j, k); }
                 else 
                    { this$1.DoRound(j, k); }
            }
            for (var j = len - 1;j > 0; j--) 
                { this$1.m_normals[j] = new ClipperLib.FPoint2(-this$1.m_normals[j - 1].X, -this$1.m_normals[j - 1].Y); }
            this$1.m_normals[0] = new ClipperLib.FPoint2(-this$1.m_normals[1].X, -this$1.m_normals[1].Y);
            k = len - 1;
            for (var j = k - 1;j > 0; --j) 
                { k = this$1.OffsetPoint(j, k, node.m_jointype); }
            if (node.m_endtype === ClipperLib.EndType.etOpenButt) {
                pt1 = new ClipperLib.FPoint2(this$1.m_srcPoly[0].X - this$1.m_normals[0].X * delta, this$1.m_srcPoly[0].Y - this$1.m_normals[0].Y * delta);
                this$1.m_destPoly.push(pt1);
                pt1 = new ClipperLib.FPoint2(this$1.m_srcPoly[0].X + this$1.m_normals[0].X * delta, this$1.m_srcPoly[0].Y + this$1.m_normals[0].Y * delta);
                this$1.m_destPoly.push(pt1);
            } else {
                k = 1;
                this$1.m_sinA = 0;
                if (node.m_endtype === ClipperLib.EndType.etOpenSquare) 
                    { this$1.DoSquare(0, 1); }
                 else 
                    { this$1.DoRound(0, 1); }
            }
            this$1.m_destPolys.push(this$1.m_destPoly);
        }
    }
};
ClipperLib.ClipperOffset.prototype.Execute = function () {
    var a = arguments, ispolytree = a[0] instanceof ClipperLib.PolyTree;
    if (!ispolytree) {
        var solution = a[0], delta = a[1];
        ClipperLib.Clear(solution);
        this.FixOrientations();
        this.DoOffset(delta);
        var clpr = new ClipperLib.Clipper(0);
        clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
        if (delta > 0) {
            clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
        } else {
            var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
            var outer = new ClipperLib.Path();
            outer.push(new ClipperLib.FPoint2(r.left - 10, r.bottom + 10));
            outer.push(new ClipperLib.FPoint2(r.right + 10, r.bottom + 10));
            outer.push(new ClipperLib.FPoint2(r.right + 10, r.top - 10));
            outer.push(new ClipperLib.FPoint2(r.left - 10, r.top - 10));
            clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
            clpr.ReverseSolution = true;
            clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
            if (solution.length > 0) 
                { solution.splice(0, 1); }
        }
    } else {
        var solution = a[0], delta = a[1];
        solution.Clear();
        this.FixOrientations();
        this.DoOffset(delta);
        var clpr = new ClipperLib.Clipper(0);
        clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
        if (delta > 0) {
            clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
        } else {
            var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
            var outer = new ClipperLib.Path();
            outer.push(new ClipperLib.FPoint2(r.left - 10, r.bottom + 10));
            outer.push(new ClipperLib.FPoint2(r.right + 10, r.bottom + 10));
            outer.push(new ClipperLib.FPoint2(r.right + 10, r.top - 10));
            outer.push(new ClipperLib.FPoint2(r.left - 10, r.top - 10));
            clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
            clpr.ReverseSolution = true;
            clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
            if (solution.ChildCount() === 1 && solution.Childs()[0].ChildCount() > 0) {
                var outerNode = solution.Childs()[0];
                solution.Childs()[0] = outerNode.Childs()[0];
                solution.Childs()[0].m_Parent = solution;
                for (var i = 1;i < outerNode.ChildCount(); i++) 
                    { solution.AddChild(outerNode.Childs()[i]); }
            } else 
                { solution.Clear(); }
        }
    }
};
ClipperLib.ClipperOffset.prototype.OffsetPoint = function (j, k, jointype) {
    this.m_sinA = this.m_normals[k].X * this.m_normals[j].Y - this.m_normals[j].X * this.m_normals[k].Y;
    if (this.m_sinA === 0) {
        return k;
    } else if (this.m_sinA > 1) 
        { this.m_sinA = 1.0; }
     else if (this.m_sinA < -1) 
        { this.m_sinA = -1.0; }
    if (this.m_sinA * this.m_delta < 0) {
        this.m_destPoly.push(new ClipperLib.FPoint2(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta, this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta));
        this.m_destPoly.push(new ClipperLib.FPoint1(this.m_srcPoly[j]));
        this.m_destPoly.push(new ClipperLib.FPoint2(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta, this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta));
    } else 
        { switch (jointype) {
        case ClipperLib.JoinType.jtMiter:
            var r = 1 + (this.m_normals[j].X * this.m_normals[k].X + this.m_normals[j].Y * this.m_normals[k].Y);
            if (r >= this.m_miterLim) 
                { this.DoMiter(j, k, r); }
             else 
                { this.DoSquare(j, k); }
            break;
        case ClipperLib.JoinType.jtSquare:
            this.DoSquare(j, k);
            break;
        case ClipperLib.JoinType.jtRound:
            this.DoRound(j, k);
            break;
    } }
    k = j;
    return k;
};
ClipperLib.ClipperOffset.prototype.DoSquare = function (j, k) {
    var dx = Math.tan(Math.atan2(this.m_sinA, this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y) / 4);
    this.m_destPoly.push(new ClipperLib.FPoint2(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[k].X - this.m_normals[k].Y * dx), this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[k].Y + this.m_normals[k].X * dx)));
    this.m_destPoly.push(new ClipperLib.FPoint2(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[j].X + this.m_normals[j].Y * dx), this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[j].Y - this.m_normals[j].X * dx)));
};
ClipperLib.ClipperOffset.prototype.DoMiter = function (j, k, r) {
    var q = this.m_delta / r;
    this.m_destPoly.push(new ClipperLib.FPoint2(this.m_srcPoly[j].X + (this.m_normals[k].X + this.m_normals[j].X) * q, this.m_srcPoly[j].Y + (this.m_normals[k].Y + this.m_normals[j].Y) * q));
};
ClipperLib.ClipperOffset.prototype.DoRound = function (j, k) {
    var this$1 = this;

    var a = Math.atan2(this.m_sinA, this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y);
    var steps = Math.max(Math.round(this.m_StepsPerRad * Math.abs(a)), 1);
    var X = this.m_normals[k].X, Y = this.m_normals[k].Y, X2;
    for (var i = 0;i < steps; ++i) {
        this$1.m_destPoly.push(new ClipperLib.FPoint2(this$1.m_srcPoly[j].X + X * this$1.m_delta, this$1.m_srcPoly[j].Y + Y * this$1.m_delta));
        X2 = X;
        X = X * this$1.m_cos - this$1.m_sin * Y;
        Y = X2 * this$1.m_sin + Y * this$1.m_cos;
    }
    this.m_destPoly.push(new ClipperLib.FPoint2(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta, this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta));
};
ClipperLib.Error = function (message) {
    try {
        throw new Error(message);
    } catch (err) {
        alert(err.message);
    }
};
ClipperLib.JS = {};
ClipperLib.JS.AreaOfPolygon = function (poly) {
    return ClipperLib.Clipper.Area(poly);
};
ClipperLib.JS.AreaOfPolygons = function (poly) {
    var area = 0;
    for (var i = 0;i < poly.length; i++) {
        area += ClipperLib.Clipper.Area(poly[i]);
    }
    return area;
};
ClipperLib.JS.BoundsOfPath = function (path) {
    return ClipperLib.JS.BoundsOfPaths([path]);
};
ClipperLib.JS.BoundsOfPaths = function (paths) {
    var bounds = ClipperLib.Clipper.GetBounds(paths);
    return bounds;
};
ClipperLib.JS.Clean = function (polygon, delta) {
    if (!(polygon instanceof Array)) 
        { return []; }
    var isPolygons = polygon[0] instanceof Array;
    var polygon = ClipperLib.JS.Clone(polygon);
    if (typeof delta !== "number" || delta === null) {
        ClipperLib.Error("Delta is not a number in Clean().");
        return polygon;
    }
    if (polygon.length === 0 || polygon.length === 1 && polygon[0].length === 0 || delta < 0) 
        { return polygon; }
    if (!isPolygons) 
        { polygon = [polygon]; }
    var k_length = polygon.length;
    var len, poly, result, d, p, j, i;
    var results = [];
    for (var k = 0;k < k_length; k++) {
        poly = polygon[k];
        len = poly.length;
        if (len === 0) 
            { continue; }
         else if (len < 3) {
            result = poly;
            results.push(result);
            continue;
        }
        result = poly;
        d = delta * delta;
        p = poly[0];
        j = 1;
        for (i = 1; i < len; i++) {
            if ((poly[i].X - p.X) * (poly[i].X - p.X) + (poly[i].Y - p.Y) * (poly[i].Y - p.Y) <= d) 
                { continue; }
            result[j] = poly[i];
            p = poly[i];
            j++;
        }
        p = poly[j - 1];
        if ((poly[0].X - p.X) * (poly[0].X - p.X) + (poly[0].Y - p.Y) * (poly[0].Y - p.Y) <= d) 
            { j--; }
        if (j < len) 
            { result.splice(j, len - j); }
        if (result.length) 
            { results.push(result); }
    }
    if (!isPolygons && results.length) 
        { results = results[0]; }
     else if (!isPolygons && results.length === 0) 
        { results = []; }
     else if (isPolygons && results.length === 0) 
        { results = [[]]; }
    return results;
};
ClipperLib.JS.Clone = function (polygon) {
    if (!(polygon instanceof Array)) 
        { return []; }
    if (polygon.length === 0) 
        { return []; }
     else if (polygon.length === 1 && polygon[0].length === 0) 
        { return [[]]; }
    var isPolygons = polygon[0] instanceof Array;
    if (!isPolygons) 
        { polygon = [polygon]; }
    var len = polygon.length, plen, i, j, result;
    var results = new Array(len);
    for (i = 0; i < len; i++) {
        plen = polygon[i].length;
        result = new Array(plen);
        for (j = 0; j < plen; j++) {
            result[j] = {
                X: polygon[i][j].X,
                Y: polygon[i][j].Y
            };
        }
        results[i] = result;
    }
    if (!isPolygons) 
        { results = results[0]; }
    return results;
};
ClipperLib.JS.Lighten = function (polygon, tolerance) {
    if (!(polygon instanceof Array)) 
        { return []; }
    if (typeof tolerance !== "number" || tolerance === null) {
        ClipperLib.Error("Tolerance is not a number in Lighten().");
        return ClipperLib.JS.Clone(polygon);
    }
    if (polygon.length === 0 || polygon.length === 1 && polygon[0].length === 0 || tolerance < 0) {
        return ClipperLib.JS.Clone(polygon);
    }
    var isPolygons = polygon[0] instanceof Array;
    if (!isPolygons) 
        { polygon = [polygon]; }
    var i, j, poly, k, poly2, plen, A, B, P, d, rem, addlast;
    var bxax, byay, l, ax, ay;
    var len = polygon.length;
    var toleranceSq = tolerance * tolerance;
    var results = [];
    for (i = 0; i < len; i++) {
        poly = polygon[i];
        plen = poly.length;
        if (plen === 0) 
            { continue; }
        for (k = 0; k < 1000000; k++) {
            poly2 = [];
            plen = poly.length;
            if (poly[plen - 1].X !== poly[0].X || poly[plen - 1].Y !== poly[0].Y) {
                addlast = 1;
                poly.push({
                    X: poly[0].X,
                    Y: poly[0].Y
                });
                plen = poly.length;
            } else 
                { addlast = 0; }
            rem = [];
            for (j = 0; j < plen - 2; j++) {
                A = poly[j];
                P = poly[j + 1];
                B = poly[j + 2];
                ax = A.X;
                ay = A.Y;
                bxax = B.X - ax;
                byay = B.Y - ay;
                if (bxax !== 0 || byay !== 0) {
                    l = ((P.X - ax) * bxax + (P.Y - ay) * byay) / (bxax * bxax + byay * byay);
                    if (l > 1) {
                        ax = B.X;
                        ay = B.Y;
                    } else if (l > 0) {
                        ax += bxax * l;
                        ay += byay * l;
                    }
                }
                bxax = P.X - ax;
                byay = P.Y - ay;
                d = bxax * bxax + byay * byay;
                if (d <= toleranceSq) {
                    rem[j + 1] = 1;
                    j++;
                }
            }
            poly2.push({
                X: poly[0].X,
                Y: poly[0].Y
            });
            for (j = 1; j < plen - 1; j++) 
                { if (!rem[j]) 
                { poly2.push({
                X: poly[j].X,
                Y: poly[j].Y
            }); } }
            poly2.push({
                X: poly[plen - 1].X,
                Y: poly[plen - 1].Y
            });
            if (addlast) 
                { poly.pop(); }
            if (!rem.length) 
                { break; }
             else 
                { poly = poly2; }
        }
        plen = poly2.length;
        if (poly2[plen - 1].X === poly2[0].X && poly2[plen - 1].Y === poly2[0].Y) {
            poly2.pop();
        }
        if (poly2.length > 2) 
            { results.push(poly2); }
    }
    if (!isPolygons) {
        results = results[0];
    }
    if (typeof results === "undefined") {
        results = [];
    }
    return results;
};
ClipperLib.JS.PerimeterOfPath = function (path, closed) {
    if (typeof path === "undefined") 
        { return 0; }
    var sqrt = Math.sqrt;
    var perimeter = 0.0;
    var p1, p2, p1x = 0.0, p1y = 0.0, p2x = 0.0, p2y = 0.0;
    var j = path.length;
    if (j < 2) 
        { return 0; }
    if (closed) {
        path[j] = path[0];
        j++;
    }
    while (--j) {
        p1 = path[j];
        p1x = p1.X;
        p1y = p1.Y;
        p2 = path[j - 1];
        p2x = p2.X;
        p2y = p2.Y;
        perimeter += sqrt((p1x - p2x) * (p1x - p2x) + (p1y - p2y) * (p1y - p2y));
    }
    if (closed) 
        { path.pop(); }
    return perimeter;
};
ClipperLib.JS.PerimeterOfPaths = function (paths, closed) {
    var perimeter = 0;
    for (var i = 0;i < paths.length; i++) {
        perimeter += ClipperLib.JS.PerimeterOfPath(paths[i], closed);
    }
    return perimeter;
};
ClipperLib.ExPolygons = function () {
    return [];
};
ClipperLib.ExPolygon = function () {
    this.outer = null;
    this.holes = null;
};
ClipperLib.JS.AddOuterPolyNodeToExPolygons = function (polynode, expolygons) {
    var ep = new ClipperLib.ExPolygon();
    ep.outer = polynode.Contour();
    var childs = polynode.Childs();
    var ilen = childs.length;
    ep.holes = new Array(ilen);
    var node, n, i, j, childs2, jlen;
    for (i = 0; i < ilen; i++) {
        node = childs[i];
        ep.holes[i] = node.Contour();
        for (j = 0, childs2 = node.Childs(), jlen = childs2.length; j < jlen; j++) {
            n = childs2[j];
            ClipperLib.JS.AddOuterPolyNodeToExPolygons(n, expolygons);
        }
    }
    expolygons.push(ep);
};
ClipperLib.JS.ExPolygonsToPaths = function (expolygons) {
    var a, i, alen, ilen;
    var paths = new ClipperLib.Paths();
    for (a = 0, alen = expolygons.length; a < alen; a++) {
        paths.push(expolygons[a].outer);
        for (i = 0, ilen = expolygons[a].holes.length; i < ilen; i++) {
            paths.push(expolygons[a].holes[i]);
        }
    }
    return paths;
};
ClipperLib.JS.PolyTreeToExPolygons = function (polytree) {
    var expolygons = new ClipperLib.ExPolygons();
    var node, i, childs, ilen;
    for (i = 0, childs = polytree.Childs(), ilen = childs.length; i < ilen; i++) {
        node = childs[i];
        ClipperLib.JS.AddOuterPolyNodeToExPolygons(node, expolygons);
    }
    return expolygons;
};
module.exports = ClipperLib;
//# sourceMappingURL=clipper-fpoint.js.map
