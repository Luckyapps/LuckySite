var sitemap = {
    template: {
        de: {
            link: "/de/template.html",
            name: "TEMPLATE"
        },
        en: {
            link: "/en/template.html",
            name: "Home"
        },
        parent: "home" //Gibt den Elternabschnitt an
    },
    home: {
        de: {
            link: "/de/",
            name: "Home"
        }
    },
    documentation:{
        de: {
            link: "/dokumentation/dokumentation.html",
            name: "Dokumentation"
        },
        parent: "home"
    },
    updates: {
        de: {
            link: "/updates.html",
            name: luckySite.version
        },
        en: {
            link: "/updates.html",
            name: luckySite.version
        },
        fr: {
            link: "/updates.html",
            name: luckySite.version
        },
        es: {
            link: "/updates.html",
            name: luckySite.version
        },
        pl: {
            link: "/updates.html",
            name: luckySite.version
        },
        ch: {
            link: "/updates.html",
            name: luckySite.version
        }
    },
    maintenance: {
        de: {
            link: "/de/wartung/",
            path: "Wartung der Seite"
        },
        en: {
            link: "/en/maintenance/",
            path: "Page under Maintenance"
        },
        ch: {
            link: "/ch/%E7%BB%B4%E6%8A%A4/",
            path: "维护"
        },
        parent: "home"
    },
    autolinkdoc:{
        de:{
            link: "/autolinkdoc.html",
            name: "AutoLink Dokumentation"
        }
    },
    getByLang: function(){ //Erstellt sitmap.byLang --> Auflistung der Seiten nach Sprache + Auflistung der ElternIds (parent)
        var sitemapLang = {}
        for(i=0;i<Object.keys(sitemap).length;i++){//Loop durch Namen
            var pageName = Object.keys(sitemap)[i];
            if(pageName != "getByLang" || pageName != "byLang"){
                for(j=0;j<Object.keys(sitemap[pageName]).length;j++){//Loop durch Sprachen
                    if(!sitemapLang[Object.keys(sitemap[pageName])[j]]){//Wenn sprache noch nicht erfasst, hinzufügen
                        sitemapLang[Object.keys(sitemap[pageName])[j]] = {
                            [pageName]: sitemap[pageName][Object.keys(sitemap[pageName])[j]]
                        }
                    }else{
                        sitemapLang[Object.keys(sitemap[pageName])[j]][pageName] = sitemap[pageName][Object.keys(sitemap[pageName])[j]];
                    }
                    //console.log(sitemapLang);
                }
            }
        }
        sitemap.byLang = sitemapLang;
        return sitemapLang;
    },
    getParent: function(id){
        if(sitemap.byLang){
            if(typeof sitemap.byLang.parent[id] != "undefined"){
                return sitemap.byLang.parent[id]
            }else{
                return false;
            }
        }else{
            sitemap.getByLang();
            console.log("Retrying getParent");
            sitemap.getParent();
        }
    }
}

sitemap.getByLang();